/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseRepository } from './BaseRepository';
import { TimelineEventSchema } from '../schemas/schemas';

export class TimelineRepository extends BaseRepository<TimelineEventSchema> {
  protected storageKey = 'timeline_events';

  async getByProfileId(profileId: string): Promise<TimelineEventSchema[]> {
    const items = await this.getAll();
    return items
      .filter(item => item.profileId === profileId)
      .sort((a, b) => {
        if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
          return a.sortOrder - b.sortOrder;
        }
        const yearA = parseInt(a.year) || 0;
        const yearB = parseInt(b.year) || 0;
        return yearA - yearB;
      });
  }

  async getByStoryId(storyId: string): Promise<TimelineEventSchema[]> {
    const items = await this.getAll();
    return items
      .filter(item => item.storyId === storyId)
      .sort((a, b) => {
        if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
          return a.sortOrder - b.sortOrder;
        }
        const yearA = parseInt(a.year) || 0;
        const yearB = parseInt(b.year) || 0;
        return yearA - yearB;
      });
  }

  async duplicate(id: string): Promise<TimelineEventSchema | null> {
    const original = await this.getById(id);
    if (!original) return null;

    const dup: TimelineEventSchema = {
      ...original,
      id: `evt-${Date.now()}`,
      title: `${original.title} (Copy)`,
      status: 'Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      schemaVersion: original.schemaVersion || 1,
    };

    const items = await this.getAll();
    items.push(dup);
    await this.saveAll(items);
    return dup;
  }

  async archive(id: string): Promise<TimelineEventSchema | null> {
    return this.update(id, { status: 'Archived' });
  }

  async restore(id: string): Promise<TimelineEventSchema | null> {
    return this.update(id, { status: 'Active' });
  }

  async reorder(id: string, direction: 'up' | 'down'): Promise<TimelineEventSchema[]> {
    const items = await this.getAll();
    // Sort items first by sortOrder (if available) or by year / date
    const sorted = [...items].sort((a, b) => {
      if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
        return a.sortOrder - b.sortOrder;
      }
      return (parseInt(a.year) || 0) - (parseInt(b.year) || 0);
    });

    const index = sorted.findIndex(item => item.id === id);
    if (index === -1) return sorted;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < sorted.length) {
      // Swap elements
      const temp = sorted[index];
      sorted[index] = sorted[targetIndex];
      sorted[targetIndex] = temp;

      // Re-assign sortOrder values to persist the new order
      sorted.forEach((item, idx) => {
        item.sortOrder = idx;
        item.updatedAt = new Date().toISOString();
      });

      await this.saveAll(sorted);
    }
    return sorted;
  }

  async search(query: string): Promise<TimelineEventSchema[]> {
    const items = await this.getAll();
    const cleanQuery = query.toLowerCase().trim();
    if (!cleanQuery) return items;

    return items.filter(item => 
      item.title.toLowerCase().includes(cleanQuery) ||
      (item.description && item.description.toLowerCase().includes(cleanQuery)) ||
      (item.location && item.location.toLowerCase().includes(cleanQuery)) ||
      (item.tags && item.tags.some(tag => tag.toLowerCase().includes(cleanQuery)))
    );
  }

  async filter(criteria: Partial<TimelineEventSchema>): Promise<TimelineEventSchema[]> {
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

  async sort(sortBy: 'chrono' | 'reverse-chrono' | 'importance' | 'title', items?: TimelineEventSchema[]): Promise<TimelineEventSchema[]> {
    const list = items || await this.getAll();
    return [...list].sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'importance') {
        const priority = { High: 3, Medium: 2, Low: 1 };
        const pA = priority[a.importance || 'Medium'] || 2;
        const pB = priority[b.importance || 'Medium'] || 2;
        return pB - pA;
      }
      
      const yearA = parseInt(a.year) || 0;
      const yearB = parseInt(b.year) || 0;
      
      if (sortBy === 'reverse-chrono') {
        return yearB - yearA;
      }
      return yearA - yearB;
    });
  }

  async count(): Promise<number> {
    const items = await this.getAll();
    return items.length;
  }
}
