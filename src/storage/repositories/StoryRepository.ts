/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseRepository } from './BaseRepository';
import { StorySchema } from '../schemas/schemas';
import { IStoryRepository } from './contracts';

export class StoryRepository extends BaseRepository<StorySchema> implements IStoryRepository {
  protected storageKey = 'stories';

  async getPinned(): Promise<StorySchema[]> {
    const items = await this.getAll();
    return items.filter(item => item.pinned);
  }

  async getFavorites(): Promise<StorySchema[]> {
    const items = await this.getAll();
    return items.filter(item => item.favorite);
  }

  async getByProfileId(profileId: string): Promise<StorySchema[]> {
    const items = await this.getAll();
    return items.filter(item => item.associatedProfileId === profileId);
  }

  async getByOwnerId(ownerId: string): Promise<StorySchema[]> {
    const items = await this.getAll();
    return items.filter(item => (item as any).ownerId === ownerId || (item as any).userId === ownerId);
  }

  async getByStatus(status: StorySchema['status']): Promise<StorySchema[]> {
    const items = await this.getAll();
    return items.filter(item => item.status === status);
  }

  async getByCategory(category: string): Promise<StorySchema[]> {
    const items = await this.getAll();
    return items.filter(item => item.category === category);
  }

  async search(query: string): Promise<StorySchema[]> {
    const items = await this.getAll();
    const cleanQuery = query.toLowerCase().trim();
    if (!cleanQuery) return items;

    return items.filter(item => 
      item.title.toLowerCase().includes(cleanQuery) ||
      item.subtitle.toLowerCase().includes(cleanQuery) ||
      (item.description && item.description.toLowerCase().includes(cleanQuery)) ||
      (item.tags && item.tags.some(tag => tag.toLowerCase().includes(cleanQuery)))
    );
  }

  async duplicate(id: string): Promise<StorySchema | null> {
    const original = await this.getById(id);
    if (!original) return null;

    const dup: StorySchema = {
      ...original,
      id: `story-${Date.now()}`,
      title: `${original.title} (Copy)`,
      subtitle: `${original.subtitle} (Copy)`,
      status: 'Draft',
      completionProgress: 15,
      pinned: false,
      favorite: false,
      lastEdited: new Date().toISOString(),
      lastGenerated: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const items = await this.getAll();
    items.push(dup);
    await this.saveAll(items);
    return dup;
  }

  async archive(id: string): Promise<StorySchema | null> {
    return this.update(id, { status: 'Archived' });
  }

  async restore(id: string): Promise<StorySchema | null> {
    return this.update(id, { status: 'Draft' });
  }

  async favorite(id: string, isFav: boolean): Promise<StorySchema | null> {
    return this.update(id, { favorite: isFav });
  }

  async pin(id: string, isPinned: boolean): Promise<StorySchema | null> {
    return this.update(id, { pinned: isPinned });
  }

  async publish(id: string): Promise<StorySchema | null> {
    return this.update(id, { status: 'Published', publishedAt: new Date().toISOString() });
  }

  async unpublish(id: string): Promise<StorySchema | null> {
    return this.update(id, { status: 'Draft' });
  }

  async updateProgress(id: string, progress: number): Promise<StorySchema | null> {
    return this.update(id, { completionProgress: Math.min(100, Math.max(0, progress)) });
  }

  async filter(criteria: Partial<StorySchema>): Promise<StorySchema[]> {
    const items = await this.getAll();
    return items.filter(item => {
      for (const key in criteria) {
        if ((item as any)[key] !== (criteria as any)[key]) {
          return false;
        }
      }
      return true;
    });
  }

  async sort(sortBy: 'updated' | 'name' | 'progress' | 'duration', items: StorySchema[]): Promise<StorySchema[]> {
    return [...items].sort((a, b) => {
      if (sortBy === 'name') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'progress') {
        return b.completionProgress - a.completionProgress;
      }
      if (sortBy === 'duration') {
        const parseDur = (d: string) => parseInt(d) || 0;
        return parseDur(b.durationEstimate) - parseDur(a.durationEstimate);
      }
      // default recently updated
      return new Date(b.lastEdited || b.updatedAt).getTime() - new Date(a.lastEdited || a.updatedAt).getTime();
    });
  }
}
