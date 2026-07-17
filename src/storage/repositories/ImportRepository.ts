/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseRepository } from './BaseRepository';
import { ImportSchema } from '../schemas/schemas';

export class ImportRepository extends BaseRepository<ImportSchema> {
  protected storageKey = 'imported_sources';

  async getFavorites(): Promise<ImportSchema[]> {
    const items = await this.getAll();
    return items.filter(item => item.favorite && !item.archived);
  }

  async getByProfileId(profileId: string): Promise<ImportSchema[]> {
    const items = await this.getAll();
    return items.filter(item => item.profileId === profileId && !item.archived);
  }

  async getByStoryId(storyId: string): Promise<ImportSchema[]> {
    const items = await this.getAll();
    return items.filter(item => item.storyId === storyId && !item.archived);
  }

  async archive(id: string): Promise<ImportSchema | null> {
    return this.update(id, { archived: true, importStatus: 'Archived' });
  }

  async restore(id: string): Promise<ImportSchema | null> {
    return this.update(id, { archived: false, importStatus: 'Pending' });
  }

  async favorite(id: string, isFavorite: boolean): Promise<ImportSchema | null> {
    return this.update(id, { favorite: isFavorite });
  }

  async rename(id: string, newName: string): Promise<ImportSchema | null> {
    return this.update(id, { displayName: newName });
  }

  async search(query: string): Promise<ImportSchema[]> {
    const items = await this.getAll();
    const cleanQuery = query.toLowerCase().trim();
    if (!cleanQuery) return items;

    return items.filter(item => 
      item.originalFilename.toLowerCase().includes(cleanQuery) ||
      item.displayName.toLowerCase().includes(cleanQuery) ||
      (item.description && item.description.toLowerCase().includes(cleanQuery)) ||
      (item.importType && item.importType.toLowerCase().includes(cleanQuery)) ||
      (item.tags && item.tags.some(tag => tag.toLowerCase().includes(cleanQuery))) ||
      (item.categories && item.categories.some(cat => cat.toLowerCase().includes(cleanQuery)))
    );
  }

  async filter(criteria: {
    importType?: string | 'all';
    archived?: boolean;
    favorite?: boolean;
    profileId?: string;
    storyId?: string;
  }): Promise<ImportSchema[]> {
    let items = await this.getAll();

    if (criteria.archived !== undefined) {
      items = items.filter(item => !!item.archived === criteria.archived);
    }
    if (criteria.favorite !== undefined) {
      items = items.filter(item => !!item.favorite === criteria.favorite);
    }
    if (criteria.importType && criteria.importType !== 'all') {
      const filterType = criteria.importType.toLowerCase();
      items = items.filter(item => {
        if (filterType === 'pdf') return item.extension.toLowerCase() === 'pdf';
        if (filterType === 'docx' || filterType === 'doc') return ['doc', 'docx'].includes(item.extension.toLowerCase());
        if (filterType === 'resume' || filterType === 'resume / cv') return item.importType.toLowerCase().includes('resume');
        if (filterType === 'biography') return item.importType.toLowerCase().includes('biography');
        if (filterType === 'memoir') return item.importType.toLowerCase().includes('memoir');
        return item.importType.toLowerCase() === filterType || item.extension.toLowerCase() === filterType;
      });
    }
    if (criteria.profileId) {
      items = items.filter(item => item.profileId === criteria.profileId);
    }
    if (criteria.storyId) {
      items = items.filter(item => item.storyId === criteria.storyId);
    }

    return items;
  }

  async sort(sortBy: 'recently-imported' | 'name' | 'size' | 'type', list?: ImportSchema[]): Promise<ImportSchema[]> {
    const targetList = list || await this.getAll();
    return [...targetList].sort((a, b) => {
      if (sortBy === 'name') {
        return a.displayName.localeCompare(b.displayName);
      }
      if (sortBy === 'size') {
        return (b.bytes || 0) - (a.bytes || 0);
      }
      if (sortBy === 'type') {
        return a.importType.localeCompare(b.importType);
      }
      // Default: recently-imported
      const dateA = new Date(a.uploadDate || a.createdAt || 0).getTime();
      const dateB = new Date(b.uploadDate || b.createdAt || 0).getTime();
      return dateB - dateA;
    });
  }
}
