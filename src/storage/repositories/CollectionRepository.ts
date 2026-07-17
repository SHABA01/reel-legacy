/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseRepository } from './BaseRepository';
import { CollectionSchema } from '../schemas/schemas';

export class CollectionRepository extends BaseRepository<CollectionSchema> {
  protected storageKey = 'collections';

  async search(query: string): Promise<CollectionSchema[]> {
    const items = await this.getAll();
    const cleanQuery = query.toLowerCase().trim();
    if (!cleanQuery) return items;

    return items.filter(item => 
      item.name.toLowerCase().includes(cleanQuery) ||
      item.description.toLowerCase().includes(cleanQuery) ||
      item.tags.some(tag => tag.toLowerCase().includes(cleanQuery))
    );
  }
}
