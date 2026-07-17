/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { persistenceService } from './PersistenceService';
import { DocumentSchema } from '../schemas/schemas';
import { NotificationService } from './NotificationService';
import { ActivityService } from './ActivityService';

export class DocumentService {
  /**
   * Validates document metadata.
   */
  static async validate(doc: Partial<DocumentSchema>): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (!doc.originalFilename || !doc.originalFilename.trim()) {
      errors.push('Missing Filename: A display name or original filename is required.');
    }

    if (!doc.profileId) {
      errors.push('Missing Legacy Profile: The document must belong to exactly one Legacy Profile.');
    }

    if (doc.bytes !== undefined && doc.bytes > 50 * 1024 * 1024) {
      errors.push('Excessive File Size: Individual document uploads cannot exceed the 50MB storage ceiling.');
    }

    if (doc.bytes === 0) {
      errors.push('Empty File: The uploaded document contains zero bytes of data.');
    }

    // Supported extensions: pdf, doc, docx, txt, rtf, odt, pages, xls, xlsx, ppt, pptx, png, jpg, jpeg (for scanned docs)
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt', '.rtf', '.odt', '.pages', '.png', '.jpg', '.jpeg', '.webp', '.tiff', '.pdf'];
    if (doc.extension) {
      const ext = doc.extension.toLowerCase();
      if (!allowedExtensions.includes(ext) && !doc.mimeType?.startsWith('image/')) {
        errors.push(`Unsupported Document Type: File format "${doc.extension}" is not supported. Please upload PDFs, Word Docs, Text Files, or Scanned Images.`);
      }
    }

    // Duplicate detection: check if filename and size match an existing active document
    if (doc.originalFilename && doc.bytes) {
      const existing = await persistenceService.documents.getAll();
      const isDuplicate = existing.some(item => 
        item.originalFilename.toLowerCase() === doc.originalFilename?.toLowerCase() && 
        item.bytes === doc.bytes &&
        item.id !== doc.id &&
        !item.archived
      );
      if (isDuplicate) {
        errors.push('Duplicate Upload Detected: An identical file with this name and size already exists in the document manager.');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Creates a new document.
   */
  static async createDocument(data: Omit<DocumentSchema, 'id' | 'createdAt' | 'updatedAt' | 'schemaVersion'> & { id?: string }): Promise<DocumentSchema> {
    const validation = await this.validate(data);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(' '));
    }

    const doc = await persistenceService.documents.create({
      ...data,
      schemaVersion: 1
    });

    await this.triggerIntegrationNotification('upload', doc);
    await this.updateProfileDocumentCount(doc.profileId);
    return doc;
  }

  /**
   * Updates an existing document's metadata.
   */
  static async updateDocument(id: string, updates: Partial<DocumentSchema>): Promise<DocumentSchema> {
    const existing = await persistenceService.documents.getById(id);
    if (!existing) {
      throw new Error(`Document with ID ${id} not found.`);
    }

    const merged = { ...existing, ...updates };
    const validation = await this.validate({ ...merged, id });
    if (!validation.isValid) {
      throw new Error(validation.errors.join(' '));
    }

    const updated = await persistenceService.documents.update(id, {
      ...updates,
      updatedAt: new Date().toISOString()
    });

    if (!updated) {
      throw new Error(`Failed to update Document with ID ${id}.`);
    }

    await this.triggerIntegrationNotification('update', updated);
    return updated;
  }

  /**
   * Archives a document.
   */
  static async archiveDocument(id: string): Promise<DocumentSchema> {
    const updated = await persistenceService.documents.archive(id);
    if (!updated) throw new Error(`Document with ID ${id} not found.`);
    await this.triggerIntegrationNotification('archive', updated);
    await this.updateProfileDocumentCount(updated.profileId);
    return updated;
  }

  /**
   * Restores a document from archive.
   */
  static async restoreDocument(id: string): Promise<DocumentSchema> {
    const updated = await persistenceService.documents.restore(id);
    if (!updated) throw new Error(`Document with ID ${id} not found.`);
    await this.triggerIntegrationNotification('restore', updated);
    await this.updateProfileDocumentCount(updated.profileId);
    return updated;
  }

  /**
   * Favorites/Unfavorites a document.
   */
  static async favoriteDocument(id: string, fav: boolean): Promise<DocumentSchema> {
    const updated = await persistenceService.documents.favorite(id, fav);
    if (!updated) throw new Error(`Document with ID ${id} not found.`);
    await this.triggerIntegrationNotification(fav ? 'favorite' : 'unfavorite', updated);
    return updated;
  }

  /**
   * Renames a document.
   */
  static async renameDocument(id: string, newName: string): Promise<DocumentSchema> {
    if (!newName || !newName.trim()) {
      throw new Error('Rename Failed: New display name cannot be empty.');
    }
    const updated = await persistenceService.documents.rename(id, newName.trim());
    if (!updated) throw new Error(`Document with ID ${id} not found.`);
    await this.triggerIntegrationNotification('rename', updated);
    return updated;
  }

  /**
   * Deletes a document.
   */
  static async deleteDocument(id: string): Promise<boolean> {
    const existing = await persistenceService.documents.getById(id);
    if (!existing) return false;
    const deleted = await persistenceService.documents.delete(id);
    if (deleted) {
      await this.triggerIntegrationNotification('delete', existing);
      await this.updateProfileDocumentCount(existing.profileId);
    }
    return deleted;
  }

  /**
   * Process a real browser File upload, extract properties, convert to local storage base64, validate, and persist.
   */
  static async processUpload(
    file: File,
    additionalData: {
      profileId: string;
      storyId?: string;
      timelineEventId?: string;
      ownerId?: string;
      categories?: string[];
      description?: string;
      tags?: string[];
      documentType?: string;
    }
  ): Promise<DocumentSchema> {
    // 1. Determine general document type
    let documentType = additionalData.documentType || 'Custom Document';
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase() || '';
    if (!additionalData.documentType) {
      if (ext === '.pdf') documentType = 'PDF';
      else if (ext === '.doc' || ext === '.docx') documentType = 'Word Document';
      else if (ext === '.txt') documentType = 'Text File';
      else if (file.type.startsWith('image/')) documentType = 'Certificate'; // Default fallback for image scans
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

    // 4. Read File as Data URL (base64) for persistence / local preview
    const dataUrl = await this.readFileAsDataURL(file);

    // 5. Build schema object
    const docData: Omit<DocumentSchema, 'id' | 'createdAt' | 'updatedAt' | 'schemaVersion'> = {
      ownerId: additionalData.ownerId || 'user-1',
      profileId: additionalData.profileId,
      storyId: additionalData.storyId,
      timelineEventId: additionalData.timelineEventId,
      originalFilename,
      displayName: originalFilename.substring(0, originalFilename.lastIndexOf('.')) || originalFilename,
      documentType,
      mimeType,
      extension: ext.replace('.', ''),
      fileSize: sizeString,
      bytes,
      uploadDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString(),
      localStorageReference: dataUrl,
      description: additionalData.description || `Uploaded archival document: ${originalFilename}`,
      tags: additionalData.tags || [],
      categories: additionalData.categories || ['Archival'],
      favorite: false,
      archived: false,
      version: 1
    };

    const created = await this.createDocument(docData);
    return created;
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
   * Automatically synchronizes document counters on Legacy Profile to maintain index accuracy.
   */
  private static async updateProfileDocumentCount(profileId?: string): Promise<void> {
    if (!profileId) return;
    try {
      const items = await persistenceService.documents.getAll();
      const count = items.filter(item => item.profileId === profileId && !item.archived).length;
      await persistenceService.profiles.update(profileId, { documentCount: count });
    } catch (err) {
      console.error('Failed to sync profile documentCount index:', err);
    }
  }

  /**
   * Dispatches notifications to make operations fully integrated with system dashboards and notifications.
   */
  private static async triggerIntegrationNotification(action: string, doc: DocumentSchema): Promise<void> {
    try {
      let title = 'Document Updated';
      let message = `Document "${doc.displayName}" has been modified.`;
      let type: 'info' | 'success' | 'warning' | 'error' = 'info';

      switch (action) {
        case 'upload':
          title = 'Document Uploaded';
          message = `New ${doc.documentType} "${doc.displayName}" (${doc.fileSize}) successfully archived.`;
          type = 'success';
          break;
        case 'delete':
          title = 'Document Deleted';
          message = `Document "${doc.displayName}" has been permanently purged from browser space.`;
          type = 'warning';
          break;
        case 'archive':
          title = 'Document Archived';
          message = `"${doc.displayName}" has been placed in the secure digital archive.`;
          type = 'info';
          break;
        case 'restore':
          title = 'Document Restored';
          message = `"${doc.displayName}" has been returned to active catalog.`;
          type = 'success';
          break;
        case 'favorite':
          title = 'Document Favorited';
          message = `"${doc.displayName}" marked as a prominent historical document.`;
          type = 'success';
          break;
        case 'rename':
          title = 'Document Renamed';
          message = `Document renamed to "${doc.displayName}".`;
          type = 'info';
          break;
      }

      if (action === 'upload') {
        await ActivityService.logActivity('Document Uploaded', message, 'bg-blue-500');
      }

      await NotificationService.createNotification(title, message, type);
    } catch (err) {
      console.error('Integration Notification failure:', err);
    }
  }

  /**
   * Retrieves high level system-driven statistics.
   */
  static async getStatistics(profileId?: string, storyId?: string): Promise<{
    total: number;
    favorites: number;
    sizeBytes: number;
    recentlyUpdated: DocumentSchema[];
    pdfs: number;
    wordDocs: number;
    certificates: number;
    letters: number;
    others: number;
    archived: number;
  }> {
    let items = await persistenceService.documents.getAll();

    if (profileId) {
      items = items.filter(item => item.profileId === profileId);
    }
    if (storyId) {
      items = items.filter(item => item.storyId === storyId);
    }

    const total = items.filter(s => !s.archived).length;
    const favorites = items.filter(s => !s.archived && s.favorite).length;
    const archived = items.filter(s => s.archived).length;

    const pdfs = items.filter(s => !s.archived && (s.extension.toLowerCase() === 'pdf' || s.documentType.toLowerCase().includes('pdf'))).length;
    const wordDocs = items.filter(s => !s.archived && (['doc', 'docx'].includes(s.extension.toLowerCase()) || s.documentType.toLowerCase().includes('word'))).length;
    const certificates = items.filter(s => !s.archived && s.documentType.toLowerCase().includes('certificate')).length;
    const letters = items.filter(s => !s.archived && s.documentType.toLowerCase().includes('letter')).length;
    const others = total - (pdfs + wordDocs + certificates + letters);

    const sizeBytes = items.reduce((acc, curr) => acc + (curr.bytes || 0), 0);

    const recentlyUpdated = [...items]
      .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime())
      .slice(0, 5);

    return {
      total,
      favorites,
      sizeBytes,
      recentlyUpdated,
      pdfs,
      wordDocs,
      certificates,
      letters,
      others,
      archived
    };
  }
}
