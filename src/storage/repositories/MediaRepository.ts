/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseRepository } from './BaseRepository';
import { MediaAssetSchema } from '../schemas/schemas';

export class MediaRepository extends BaseRepository<MediaAssetSchema> {
  protected storageKey = 'media_assets';

  async getFavorites(): Promise<MediaAssetSchema[]> {
    const items = await this.getAll();
    return items.filter(item => item.favorite && !item.archived);
  }

  async getByType(type: MediaAssetSchema['type']): Promise<MediaAssetSchema[]> {
    const items = await this.getAll();
    return items.filter(item => item.type === type && !item.archived);
  }

  async getByStoryId(storyId: string): Promise<MediaAssetSchema[]> {
    const items = await this.getAll();
    return items.filter(item => item.linkedStoryId === storyId && !item.archived);
  }

  async getByProfileId(profileId: string): Promise<MediaAssetSchema[]> {
    const items = await this.getAll();
    return items.filter(item => (item.profileId === profileId || item.legacyProfileId === profileId) && !item.archived);
  }

  async archive(id: string): Promise<MediaAssetSchema | null> {
    return this.update(id, { archived: true });
  }

  async restore(id: string): Promise<MediaAssetSchema | null> {
    return this.update(id, { archived: false });
  }

  async favorite(id: string, isFavorite: boolean): Promise<MediaAssetSchema | null> {
    return this.update(id, { favorite: isFavorite });
  }

  async rename(id: string, newName: string): Promise<MediaAssetSchema | null> {
    return this.update(id, { name: newName, displayName: newName });
  }

  async search(query: string): Promise<MediaAssetSchema[]> {
    const items = await this.getAll();
    const cleanQuery = query.toLowerCase().trim();
    if (!cleanQuery) return items;

    return items.filter(item => 
      item.name.toLowerCase().includes(cleanQuery) ||
      (item.displayName && item.displayName.toLowerCase().includes(cleanQuery)) ||
      (item.description && item.description.toLowerCase().includes(cleanQuery)) ||
      (item.category && item.category.toLowerCase().includes(cleanQuery)) ||
      (item.tags && item.tags.some(tag => tag.toLowerCase().includes(cleanQuery)))
    );
  }

  async filter(criteria: {
    type?: MediaAssetSchema['type'] | 'all';
    archived?: boolean;
    favorite?: boolean;
    profileId?: string;
    storyId?: string;
  }): Promise<MediaAssetSchema[]> {
    let items = await this.getAll();

    if (criteria.archived !== undefined) {
      items = items.filter(item => !!item.archived === criteria.archived);
    }
    if (criteria.favorite !== undefined) {
      items = items.filter(item => !!item.favorite === criteria.favorite);
    }
    if (criteria.type && criteria.type !== 'all') {
      items = items.filter(item => item.type === criteria.type);
    }
    if (criteria.profileId) {
      items = items.filter(item => item.profileId === criteria.profileId || item.legacyProfileId === criteria.profileId);
    }
    if (criteria.storyId) {
      items = items.filter(item => item.linkedStoryId === criteria.storyId);
    }

    return items;
  }

  async sort(sortBy: 'recently-uploaded' | 'name' | 'size' | 'type', list?: MediaAssetSchema[]): Promise<MediaAssetSchema[]> {
    const targetList = list || await this.getAll();
    return [...targetList].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'size') {
        return (b.bytes || 0) - (a.bytes || 0);
      }
      if (sortBy === 'type') {
        return a.type.localeCompare(b.type);
      }
      // Default: recently-uploaded
      const dateA = new Date(a.uploadDate || a.createdAt || 0).getTime();
      const dateB = new Date(b.uploadDate || b.createdAt || 0).getTime();
      return dateB - dateA;
    });
  }
}
