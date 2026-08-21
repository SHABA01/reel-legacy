/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseRepository } from './BaseRepository';
import { LegacyProfileSchema } from '../schemas/schemas';
import { ILegacyProfileRepository } from './contracts';

export class LegacyProfileRepository extends BaseRepository<LegacyProfileSchema> implements ILegacyProfileRepository {
  protected storageKey = 'profiles';

  async getByUserId(userId: string): Promise<LegacyProfileSchema[]> {
    const items = await this.getAll();
    return items.filter(item => (item as any).userId === userId || (item as any).ownerId === userId);
  }

  async getByCategory(category: string): Promise<LegacyProfileSchema[]> {
    const items = await this.getAll();
    return items.filter(item => item.category === category);
  }

  async search(query: string): Promise<LegacyProfileSchema[]> {
    const items = await this.getAll();
    const cleanQuery = query.toLowerCase().trim();
    if (!cleanQuery) return items;

    return items.filter(item => 
      item.firstName.toLowerCase().includes(cleanQuery) ||
      item.lastName.toLowerCase().includes(cleanQuery) ||
      item.nickname?.toLowerCase().includes(cleanQuery) ||
      item.relationship.toLowerCase().includes(cleanQuery) ||
      item.biographySummary?.toLowerCase().includes(cleanQuery)
    );
  }

  async archive(id: string): Promise<LegacyProfileSchema | null> {
    return this.update(id, { status: 'archived' });
  }

  async restore(id: string): Promise<LegacyProfileSchema | null> {
    return this.update(id, { status: 'published' });
  }

  async updateProgress(id: string, progress: number): Promise<LegacyProfileSchema | null> {
    return this.update(id, { storyProgress: Math.min(100, Math.max(0, progress)) });
  }
}
