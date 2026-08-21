/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseRepository } from './BaseRepository';
import { StoryChapterSchema } from '../schemas/schemas';
import { StorageAdapter } from '../adapters/StorageAdapter';
import { IStoryChapterRepository } from './contracts';

export class StoryChapterRepository extends BaseRepository<StoryChapterSchema> implements IStoryChapterRepository {
  protected storageKey = 'story_chapters';

  constructor(adapter: StorageAdapter) {
    super(adapter);
  }

  async getByStoryId(storyId: string): Promise<StoryChapterSchema[]> {
    const items = await this.getAll();
    return items
      .filter(item => item.storyId === storyId)
      .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
  }

  async reorder(storyId: string, orderedChapterIds: string[]): Promise<boolean> {
    const all = await this.getAll();
    const map = new Map(orderedChapterIds.map((id, index) => [id, index]));

    const updated = all.map(chapter => {
      if (chapter.storyId === storyId && map.has(chapter.id)) {
        return {
          ...chapter,
          orderIndex: map.get(chapter.id)!,
          updatedAt: new Date().toISOString(),
        };
      }
      return chapter;
    });

    await this.saveAll(updated);
    return true;
  }
}
