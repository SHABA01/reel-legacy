/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseRepository } from './BaseRepository';
import { DocumentSchema } from '../schemas/schemas';

export class DocumentRepository extends BaseRepository<DocumentSchema> {
  protected storageKey = 'document_assets';

  async getFavorites(): Promise<DocumentSchema[]> {
    const items = await this.getAll();
    return items.filter(item => item.favorite && !item.archived);
  }

  async getByProfileId(profileId: string): Promise<DocumentSchema[]> {
    const items = await this.getAll();
    return items.filter(item => item.profileId === profileId && !item.archived);
  }

  async getByStoryId(storyId: string): Promise<DocumentSchema[]> {
    const items = await this.getAll();
    return items.filter(item => item.storyId === storyId && !item.archived);
  }

  async getByEventId(eventId: string): Promise<DocumentSchema[]> {
    const items = await this.getAll();
    return items.filter(item => item.timelineEventId === eventId && !item.archived);
  }

  async archive(id: string): Promise<DocumentSchema | null> {
    return this.update(id, { archived: true });
  }

  async restore(id: string): Promise<DocumentSchema | null> {
    return this.update(id, { archived: false });
  }

  async favorite(id: string, isFavorite: boolean): Promise<DocumentSchema | null> {
    return this.update(id, { favorite: isFavorite });
  }

  async rename(id: string, newName: string): Promise<DocumentSchema | null> {
    return this.update(id, { displayName: newName });
  }

  async search(query: string): Promise<DocumentSchema[]> {
    const items = await this.getAll();
    const cleanQuery = query.toLowerCase().trim();
    if (!cleanQuery) return items;

    return items.filter(item => 
      item.originalFilename.toLowerCase().includes(cleanQuery) ||
      item.displayName.toLowerCase().includes(cleanQuery) ||
      (item.description && item.description.toLowerCase().includes(cleanQuery)) ||
      (item.documentType && item.documentType.toLowerCase().includes(cleanQuery)) ||
      (item.tags && item.tags.some(tag => tag.toLowerCase().includes(cleanQuery))) ||
      (item.categories && item.categories.some(cat => cat.toLowerCase().includes(cleanQuery)))
    );
  }

  async filter(criteria: {
    documentType?: string | 'all';
    archived?: boolean;
    favorite?: boolean;
    profileId?: string;
    storyId?: string;
    timelineEventId?: string;
  }): Promise<DocumentSchema[]> {
    let items = await this.getAll();

    if (criteria.archived !== undefined) {
      items = items.filter(item => !!item.archived === criteria.archived);
    }
    if (criteria.favorite !== undefined) {
      items = items.filter(item => !!item.favorite === criteria.favorite);
    }
    if (criteria.documentType && criteria.documentType !== 'all') {
      // Normalize comparison
      const filterType = criteria.documentType.toLowerCase();
      items = items.filter(item => {
        if (filterType === 'pdf') return item.extension.toLowerCase() === 'pdf' || item.documentType.toLowerCase().includes('pdf');
        if (filterType === 'word') return ['doc', 'docx'].includes(item.extension.toLowerCase()) || item.documentType.toLowerCase().includes('word');
        if (filterType === 'certificate') return item.documentType.toLowerCase().includes('certificate');
        if (filterType === 'letter') return item.documentType.toLowerCase().includes('letter');
        return item.documentType.toLowerCase() === filterType;
      });
    }
    if (criteria.profileId) {
      items = items.filter(item => item.profileId === criteria.profileId);
    }
    if (criteria.storyId) {
      items = items.filter(item => item.storyId === criteria.storyId);
    }
    if (criteria.timelineEventId) {
      items = items.filter(item => item.timelineEventId === criteria.timelineEventId);
    }

    return items;
  }

  async sort(sortBy: 'recently-uploaded' | 'name' | 'size' | 'type', list?: DocumentSchema[]): Promise<DocumentSchema[]> {
    const targetList = list || await this.getAll();
    return [...targetList].sort((a, b) => {
      if (sortBy === 'name') {
        return a.displayName.localeCompare(b.displayName);
      }
      if (sortBy === 'size') {
        return (b.bytes || 0) - (a.bytes || 0);
      }
      if (sortBy === 'type') {
        return a.documentType.localeCompare(b.documentType);
      }
      // Default: recently-uploaded
      const dateA = new Date(a.uploadDate || a.createdAt || 0).getTime();
      const dateB = new Date(b.uploadDate || b.createdAt || 0).getTime();
      return dateB - dateA;
    });
  }
}
