/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { persistenceService } from './PersistenceService';
import { MediaAssetSchema } from '../schemas/schemas';
import { NotificationService } from './NotificationService';
import { ActivityService } from './ActivityService';

export class MediaService {
  /**
   * Validates media asset metadata.
   */
  static async validate(asset: Partial<MediaAssetSchema>): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (!asset.name || !asset.name.trim()) {
      errors.push('Missing Filename: A display name or original filename is required.');
    }

    if (!asset.profileId && !asset.legacyProfileId) {
      errors.push('Missing Legacy Profile: The media asset must belong to exactly one Legacy Profile.');
    }

    if (asset.bytes !== undefined && asset.bytes > 50 * 1024 * 1024) {
      errors.push('Excessive File Size: Individual media uploads cannot exceed the 50MB storage ceiling.');
    }

    if (asset.bytes === 0) {
      errors.push('Empty File: The uploaded media asset contains zero bytes of data.');
    }

    // Duplicate detection: check if name and size match an existing active asset
    if (asset.name && asset.bytes) {
      const existing = await persistenceService.media.getAll();
      const isDuplicate = existing.some(item => 
        item.name.toLowerCase() === asset.name?.toLowerCase() && 
        item.bytes === asset.bytes &&
        item.id !== asset.id &&
        !item.archived
      );
      if (isDuplicate) {
        errors.push('Duplicate Upload Detected: An identical file with this name and size already exists.');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Creates a new media asset entry.
   */
  static async createMedia(data: Omit<MediaAssetSchema, 'id' | 'createdAt' | 'updatedAt' | 'schemaVersion'> & { id?: string }): Promise<MediaAssetSchema> {
    const validation = await this.validate(data);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(' '));
    }

    const media = await persistenceService.media.create({
      ...data,
      schemaVersion: 1
    });

    await this.triggerIntegrationNotification('upload', media);
    await this.updateProfileMediaCount(media.profileId || media.legacyProfileId);
    return media;
  }

  /**
   * Updates an existing media asset's metadata.
   */
  static async updateMedia(id: string, updates: Partial<MediaAssetSchema>): Promise<MediaAssetSchema> {
    const existing = await persistenceService.media.getById(id);
    if (!existing) {
      throw new Error(`Media Asset with ID ${id} not found.`);
    }

    const merged = { ...existing, ...updates };
    // Skip duplicate check on self during update validation
    const validation = await this.validate({ ...merged, id });
    if (!validation.isValid) {
      throw new Error(validation.errors.join(' '));
    }

    const updated = await persistenceService.media.update(id, {
      ...updates,
      updatedAt: new Date().toISOString()
    });

    if (!updated) {
      throw new Error(`Failed to update Media Asset with ID ${id}.`);
    }

    await this.triggerIntegrationNotification('update', updated);
    return updated;
  }

  /**
   * Deletes a media asset permanently.
   */
  static async deleteMedia(id: string): Promise<boolean> {
    const existing = await persistenceService.media.getById(id);
    if (!existing) return false;

    const deleted = await persistenceService.media.delete(id);
    if (deleted) {
      await this.triggerIntegrationNotification('delete', existing);
      await this.updateProfileMediaCount(existing.profileId || existing.legacyProfileId);
    }
    return deleted;
  }

  /**
   * Archives a media asset.
   */
  static async archiveMedia(id: string): Promise<MediaAssetSchema> {
    const updated = await persistenceService.media.archive(id);
    if (!updated) throw new Error(`Media Asset with ID ${id} not found.`);
    await this.triggerIntegrationNotification('archive', updated);
    return updated;
  }

  /**
   * Restores a media asset from archive.
   */
  static async restoreMedia(id: string): Promise<MediaAssetSchema> {
    const updated = await persistenceService.media.restore(id);
    if (!updated) throw new Error(`Media Asset with ID ${id} not found.`);
    await this.triggerIntegrationNotification('restore', updated);
    return updated;
  }

  /**
   * Favorites/Unfavorites a media asset.
   */
  static async favoriteMedia(id: string, fav: boolean): Promise<MediaAssetSchema> {
    const updated = await persistenceService.media.favorite(id, fav);
    if (!updated) throw new Error(`Media Asset with ID ${id} not found.`);
    await this.triggerIntegrationNotification(fav ? 'favorite' : 'unfavorite', updated);
    return updated;
  }

  /**
   * Renames a media asset.
   */
  static async renameMedia(id: string, newName: string): Promise<MediaAssetSchema> {
    if (!newName || !newName.trim()) {
      throw new Error('Rename Failed: New display name cannot be empty.');
    }
    const updated = await persistenceService.media.rename(id, newName.trim());
    if (!updated) throw new Error(`Media Asset with ID ${id} not found.`);
    await this.triggerIntegrationNotification('rename', updated);
    return updated;
  }

  /**
   * Process a real browser File upload, extract properties, convert to local storage base64, validate, and persist.
   */
  static async processUpload(
    file: File,
    additionalData: {
      profileId: string;
      storyId?: string;
      storyName?: string;
      userId?: string;
      category?: string;
      description?: string;
      tags?: string[];
    }
  ): Promise<MediaAssetSchema> {
    // 1. Determine general media type
    let type: 'image' | 'video' | 'audio' | 'document' = 'document';
    if (file.type.startsWith('image/')) {
      type = 'image';
    } else if (file.type.startsWith('video/')) {
      type = 'video';
    } else if (file.type.startsWith('audio/')) {
      type = 'audio';
    } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
      type = 'document';
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
    const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase() || '';
    const mimeType = file.type || 'application/octet-stream';

    // 4. Read File as Data URL (base64) for persistence / local preview
    const dataUrl = await this.readFileAsDataURL(file);

    // 5. Build schema object
    const assetData: Omit<MediaAssetSchema, 'id' | 'createdAt' | 'updatedAt'> = {
      name: file.name,
      type,
      category: additionalData.category || 'Family Highlight',
      size: sizeString,
      bytes,
      resolution: type === 'image' ? 'Dynamic' : undefined,
      duration: undefined,
      uploadDate: new Date().toISOString(),
      tags: additionalData.tags || [],
      linkedStoryId: additionalData.storyId || '',
      linkedStoryName: additionalData.storyName || '',
      linkedEvents: [],
      linkedChapters: [],
      favorite: false,
      status: 'Ready',
      thumbnailUrl: dataUrl, // local base64 source for immediate rendering
      description: additionalData.description || `Uploaded file: ${file.name}`,
      archived: false,

      // Extra metadata properties
      ownerId: additionalData.userId || 'user-1',
      profileId: additionalData.profileId,
      legacyProfileId: additionalData.profileId,
      originalFilename,
      displayName: file.name.replace(extension, ''),
      mimeType,
      extension,
      lastModified: new Date(file.lastModified).toISOString(),
      localStorageReference: `base64_local_${Date.now()}`,
      categories: [additionalData.category || 'Family Highlight'],
      metadata: {
        lastModifiedBrowser: file.lastModified,
        browserMime: file.type
      },
      version: 1,
      schemaVersion: 1
    };

    // 6. Validate and Save
    const validation = await this.validate(assetData);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(' '));
    }

    const created = await persistenceService.media.create(assetData);
    await this.triggerIntegrationNotification('upload', created);
    await this.updateProfileMediaCount(additionalData.profileId);
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
   * Automatically synchronizes media counters on Legacy Profile to maintain index accuracy.
   */
  private static async updateProfileMediaCount(profileId?: string): Promise<void> {
    if (!profileId) return;
    try {
      const items = await persistenceService.media.getAll();
      const count = items.filter(item => (item.profileId === profileId || item.legacyProfileId === profileId) && !item.archived).length;
      await persistenceService.profiles.update(profileId, { mediaCount: count });
    } catch (err) {
      console.error('Failed to sync profile mediaCount index:', err);
    }
  }

  /**
   * Dispatches notifications to make operations fully integrated with system dashboards and notifications.
   */
  private static async triggerIntegrationNotification(action: string, media: MediaAssetSchema): Promise<void> {
    try {
      let title = 'Media Updated';
      let message = `Media asset "${media.name}" has been modified.`;
      let type: 'info' | 'success' | 'warning' | 'error' = 'info';

      switch (action) {
        case 'upload':
          title = 'Media Uploaded';
          message = `New ${media.type} "${media.name}" (${media.size}) successfully cataloged in archive.`;
          type = 'success';
          break;
        case 'delete':
          title = 'Media Deleted';
          message = `Media asset "${media.name}" has been permanently purged from browser space.`;
          type = 'warning';
          break;
        case 'archive':
          title = 'Media Archived';
          message = `"${media.name}" has been placed in the file storage vault.`;
          type = 'info';
          break;
        case 'restore':
          title = 'Media Restored';
          message = `"${media.name}" has been returned to active catalog.`;
          type = 'success';
          break;
        case 'favorite':
          title = 'Media Favorited';
          message = `"${media.name}" marked as family favorite highlight.`;
          type = 'success';
          break;
        case 'rename':
          title = 'Media Renamed';
          message = `Media asset renamed to "${media.name}".`;
          type = 'info';
          break;
      }

      if (action === 'upload') {
        await ActivityService.logActivity('Media Uploaded', message, 'bg-sky-500');
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
    recentlyUpdated: MediaAssetSchema[];
    images: number;
    videos: number;
    audio: number;
    documents: number;
    archived: number;
  }> {
    let items = await persistenceService.media.getAll();

    if (profileId) {
      items = items.filter(item => item.profileId === profileId || item.legacyProfileId === profileId);
    }
    if (storyId) {
      items = items.filter(item => item.linkedStoryId === storyId);
    }

    const total = items.filter(s => !s.archived).length;
    const favorites = items.filter(s => !s.archived && s.favorite).length;
    const archived = items.filter(s => s.archived).length;

    const images = items.filter(s => !s.archived && s.type === 'image').length;
    const videos = items.filter(s => !s.archived && s.type === 'video').length;
    const audio = items.filter(s => !s.archived && s.type === 'audio').length;
    const documents = items.filter(s => !s.archived && s.type === 'document').length;

    const sizeBytes = items.reduce((acc, curr) => acc + (curr.bytes || 0), 0);

    const recentlyUpdated = [...items]
      .sort((a, b) => new Date(b.updatedAt || b.uploadDate || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.uploadDate || a.createdAt || 0).getTime())
      .slice(0, 5);

    return {
      total,
      favorites,
      sizeBytes,
      recentlyUpdated,
      images,
      videos,
      audio,
      documents,
      archived
    };
  }
}
