/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { persistenceService } from './PersistenceService';
import { ImportSchema } from '../schemas/schemas';
import { NotificationService } from './NotificationService';
import { ActivityService } from './ActivityService';

export class ImportService {
  /**
   * Validates import metadata.
   */
  static async validate(importData: Partial<ImportSchema>): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (!importData.originalFilename || !importData.originalFilename.trim()) {
      errors.push('Missing Filename: An original filename or display name is required.');
    }

    if (!importData.profileId) {
      errors.push('Missing Legacy Profile: Every import must belong to exactly one Legacy Profile.');
    }

    if (importData.bytes !== undefined && importData.bytes > 50 * 1024 * 1024) {
      errors.push('Excessive File Size: Individual imported files cannot exceed the 50MB storage ceiling.');
    }

    if (importData.bytes === 0) {
      errors.push('Empty File: The uploaded document contains zero bytes of data.');
    }

    // Allowed extensions for resumes, bio records etc.
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt', '.rtf', '.odt', '.pages', '.png', '.jpg', '.jpeg', '.webp'];
    if (importData.extension) {
      const ext = importData.extension.toLowerCase();
      // Allow general format validation. Let's make it robust.
      const hasValidExtension = allowedExtensions.includes(ext) || allowedExtensions.includes('.' + ext);
      if (!hasValidExtension && !importData.mimeType?.startsWith('image/')) {
        errors.push(`Unsupported Document Type: File format "${importData.extension}" is not supported. Please upload PDFs, Word Docs, Text Files, or Scanned Images.`);
      }
    }

    // Duplicate detection: check if filename and size match an existing active import
    if (importData.originalFilename && importData.bytes) {
      const existing = await persistenceService.imports.getAll();
      const isDuplicate = existing.some(item => 
        item.originalFilename.toLowerCase() === importData.originalFilename?.toLowerCase() && 
        item.bytes === importData.bytes &&
        item.id !== importData.id &&
        !item.archived
      );
      if (isDuplicate) {
        errors.push('Duplicate Upload Detected: An identical file with this name and size already exists in the import registry.');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Creates a new import record.
   */
  static async createImport(data: Omit<ImportSchema, 'id' | 'createdAt' | 'updatedAt' | 'schemaVersion'> & { id?: string }): Promise<ImportSchema> {
    const validation = await this.validate(data);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(' '));
    }

    const created = await persistenceService.imports.create({
      ...data,
      schemaVersion: 1
    });

    await this.triggerIntegrationNotification('import', created);
    await this.updateProfileImportCount(created.profileId);
    return created;
  }

  /**
   * Updates an existing import record.
   */
  static async updateImport(id: string, updates: Partial<ImportSchema>): Promise<ImportSchema> {
    const existing = await persistenceService.imports.getById(id);
    if (!existing) {
      throw new Error(`Import record with ID ${id} not found.`);
    }

    const merged = { ...existing, ...updates };
    const validation = await this.validate({ ...merged, id });
    if (!validation.isValid) {
      throw new Error(validation.errors.join(' '));
    }

    const updated = await persistenceService.imports.update(id, {
      ...updates,
      updatedAt: new Date().toISOString()
    });

    if (!updated) {
      throw new Error(`Failed to update Import record with ID ${id}.`);
    }

    await this.triggerIntegrationNotification('update', updated);
    return updated;
  }

  /**
   * Archives an import record.
   */
  static async archiveImport(id: string): Promise<ImportSchema> {
    const updated = await persistenceService.imports.archive(id);
    if (!updated) throw new Error(`Import record with ID ${id} not found.`);
    await this.triggerIntegrationNotification('archive', updated);
    return updated;
  }

  /**
   * Restores an import record from archive.
   */
  static async restoreImport(id: string): Promise<ImportSchema> {
    const updated = await persistenceService.imports.restore(id);
    if (!updated) throw new Error(`Import record with ID ${id} not found.`);
    await this.triggerIntegrationNotification('restore', updated);
    return updated;
  }

  /**
   * Favorites/Unfavorites an import record.
   */
  static async favoriteImport(id: string, fav: boolean): Promise<ImportSchema> {
    const updated = await persistenceService.imports.favorite(id, fav);
    if (!updated) throw new Error(`Import record with ID ${id} not found.`);
    await this.triggerIntegrationNotification(fav ? 'favorite' : 'unfavorite', updated);
    return updated;
  }

  /**
   * Renames an import record.
   */
  static async renameImport(id: string, newName: string): Promise<ImportSchema> {
    if (!newName || !newName.trim()) {
      throw new Error('Rename Failed: New display name cannot be empty.');
    }
    const updated = await persistenceService.imports.rename(id, newName.trim());
    if (!updated) throw new Error(`Import record with ID ${id} not found.`);
    await this.triggerIntegrationNotification('rename', updated);
    return updated;
  }

  /**
   * Deletes an import record.
   */
  static async deleteImport(id: string): Promise<boolean> {
    const existing = await persistenceService.imports.getById(id);
    if (!existing) return false;
    const deleted = await persistenceService.imports.delete(id);
    if (deleted) {
      await this.triggerIntegrationNotification('delete', existing);
      await this.updateProfileImportCount(existing.profileId);
    }
    return deleted;
  }

  /**
   * Processes a browser File object, reading its content as base64, extracting metadata and persisting it.
   */
  static async processUpload(
    file: File,
    additionalData: {
      profileId: string;
      storyId?: string;
      ownerId?: string;
      importType?: string;
      description?: string;
      tags?: string[];
      categories?: string[];
    }
  ): Promise<ImportSchema> {
    // 1. Determine general import type
    let importType = additionalData.importType || 'Resume / CV';
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase() || '';
    if (!additionalData.importType) {
      if (ext === '.pdf') importType = 'Resume / CV';
      else if (ext === '.doc' || ext === '.docx') importType = 'Biography';
      else if (ext === '.txt') importType = 'Personal Notes';
      else if (file.type.startsWith('image/')) importType = 'Scanned Biography';
    }

    // 2. Format size string
    const bytes = file.size;
    let sizeString = '0 Bytes';
    if (bytes >= 1024 * 1024) {
      sizeString = `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    } else if (bytes >= 1024) {
      sizeString = `${(bytes / 1024).toFixed(1)} KB`;
    } else {
      sizeString = `${bytes} Bytes`;
    }

    // 3. Extract metadata
    const originalFilename = file.name;
    const mimeType = file.type || 'application/octet-stream';

    // 4. Read File as Data URL (base64) for browser persistence & client side rendering
    const dataUrl = await this.readFileAsDataURL(file);

    // 5. Build schema object
    const importData: Omit<ImportSchema, 'id' | 'createdAt' | 'updatedAt' | 'schemaVersion'> = {
      ownerId: additionalData.ownerId || 'user-1',
      profileId: additionalData.profileId,
      storyId: additionalData.storyId,
      originalFilename,
      displayName: originalFilename.substring(0, originalFilename.lastIndexOf('.')) || originalFilename,
      importType,
      mimeType,
      extension: ext.replace('.', ''),
      fileSize: sizeString,
      bytes,
      uploadDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString(),
      localStorageReference: dataUrl,
      description: additionalData.description || `Imported legacy resource: ${originalFilename}`,
      tags: additionalData.tags || [],
      categories: additionalData.categories || ['Imported'],
      importStatus: 'Pending',
      favorite: false,
      archived: false,
      version: 1
    };

    const created = await this.createImport(importData);
    return created;
  }

  /**
   * Generates summary statistics of the imports repository.
   */
  static async getStatistics(profileId?: string): Promise<{
    totalCount: number;
    totalBytes: number;
    typeDistribution: Record<string, number>;
    statusDistribution: Record<string, number>;
  }> {
    const all = await persistenceService.imports.getAll();
    const filtered = profileId ? all.filter(item => item.profileId === profileId) : all;

    const typeDistribution: Record<string, number> = {};
    const statusDistribution: Record<string, number> = {};
    let totalBytes = 0;

    for (const item of filtered) {
      if (!item.archived) {
        totalBytes += item.bytes || 0;
        typeDistribution[item.importType] = (typeDistribution[item.importType] || 0) + 1;
        typeDistribution[item.extension.toUpperCase()] = (typeDistribution[item.extension.toUpperCase()] || 0) + 1;
        statusDistribution[item.importStatus] = (statusDistribution[item.importStatus] || 0) + 1;
      }
    }

    return {
      totalCount: filtered.filter(i => !i.archived).length,
      totalBytes,
      typeDistribution,
      statusDistribution
    };
  }

  /**
   * Helper to convert File to Base64 String
   */
  private static readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  /**
   * Trigger UI-bound notifications and background telemetry logs.
   */
  private static async triggerIntegrationNotification(
    action: 'import' | 'update' | 'archive' | 'restore' | 'favorite' | 'unfavorite' | 'rename' | 'delete',
    doc: ImportSchema
  ): Promise<void> {
    const titles = {
      import: 'Source File Registered',
      update: 'Archival Record Adjusted',
      archive: 'Record Moved to Vault',
      restore: 'Record Re-activated',
      favorite: 'Import Pinned as Highlight',
      unfavorite: 'Import Unpinned',
      rename: 'Archival Registry Renamed',
      delete: 'Import Permanently Purged'
    };

    const messages = {
      import: `File "${doc.displayName}" has been indexed and structured for future AI synthesis.`,
      update: `Metadata credentials for "${doc.displayName}" were successfully modified.`,
      archive: `"${doc.displayName}" was safely deposited in the digital archive vault.`,
      restore: `"${doc.displayName}" has been restored to the active import ledger.`,
      favorite: `"${doc.displayName}" is now set as a key anchor for timeline events.`,
      unfavorite: `"${doc.displayName}" was removed from highlights.`,
      rename: `Archival record changed registry name to "${doc.displayName}".`,
      delete: `Permanently removed "${doc.displayName}" and cleared local storage tracks.`
    };

    const types: Record<string, 'info' | 'success' | 'warning' | 'error'> = {
      import: 'success',
      update: 'success',
      archive: 'info',
      restore: 'success',
      favorite: 'success',
      unfavorite: 'info',
      rename: 'success',
      delete: 'warning'
    };

    if (action === 'import') {
      await ActivityService.logActivity(
        'Resume Imported',
        messages[action],
        'bg-teal-500'
      );
    }

    await NotificationService.createNotification(
      titles[action] || 'Import Event',
      messages[action] || `Action ${action} succeeded for ${doc.displayName}`,
      types[action] || 'info'
    );
  }

  /**
   * Sync document count in the legacy profile model.
   */
  private static async updateProfileImportCount(profileId: string): Promise<void> {
    try {
      const imports = await persistenceService.imports.getByProfileId(profileId);
      const activeImports = imports.filter(i => !i.archived);
      
      // Fetch and update the legacy profile
      const profile = await persistenceService.profiles.getById(profileId);
      if (profile) {
        // Increment or set the total documentCount if needed
        const currentDocCount = profile.documentCount || 0;
        await persistenceService.profiles.update(profileId, {
          documentCount: Math.max(currentDocCount, activeImports.length)
        });
      }
    } catch (err) {
      console.error('Failed to update profile document count:', err);
    }
  }
}
