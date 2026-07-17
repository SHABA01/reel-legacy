/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseRepository } from './BaseRepository';
import { LegacyProfileSchema } from '../schemas/schemas';

export class LegacyProfileRepository extends BaseRepository<LegacyProfileSchema> {
  protected storageKey = 'profiles';

  async getByCategory(category: LegacyProfileSchema['category']): Promise<LegacyProfileSchema[]> {
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
      item.relationship.toLowerCase().includes(cleanQuery)
    );
  }
}
