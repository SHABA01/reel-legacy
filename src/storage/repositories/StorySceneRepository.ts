/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseRepository } from './BaseRepository';
import { StorySceneSchema } from '../schemas/schemas';
import { StorageAdapter } from '../adapters/StorageAdapter';
import { IStorySceneRepository } from './contracts';

export class StorySceneRepository extends BaseRepository<StorySceneSchema> implements IStorySceneRepository {
  protected storageKey = 'story_scenes';

  constructor(adapter: StorageAdapter) {
    super(adapter);
  }

  async getByStoryId(storyId: string): Promise<StorySceneSchema[]> {
    const items = await this.getAll();
    return items
      .filter(item => item.storyId === storyId)
      .sort((a, b) => (a.sceneNumber ?? 1) - (b.sceneNumber ?? 1));
  }

  async getByChapterId(chapterId: string): Promise<StorySceneSchema[]> {
    const items = await this.getAll();
    return items
      .filter(item => item.chapterId === chapterId)
      .sort((a, b) => (a.sceneNumber ?? 1) - (b.sceneNumber ?? 1));
  }

  async reorder(chapterId: string, orderedSceneIds: string[]): Promise<boolean> {
    const all = await this.getAll();
    const map = new Map(orderedSceneIds.map((id, index) => [id, index + 1]));

    const updated = all.map(scene => {
      if (scene.chapterId === chapterId && map.has(scene.id)) {
        return {
          ...scene,
          sceneNumber: map.get(scene.id)!,
          updatedAt: new Date().toISOString(),
        };
      }
      return scene;
    });

    await this.saveAll(updated);
    return true;
  }
}
