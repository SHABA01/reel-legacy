/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  LegacyProfileSchema,
  StorySchema,
  StoryChapterSchema,
  StorySceneSchema,
  MediaAssetSchema,
} from '../schemas/schemas';

export interface IBaseEntityRepository<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(item: Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'schemaVersion'> & { id?: string; schemaVersion?: number }): Promise<T>;
  update(id: string, updates: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  deleteMany?(ids: string[]): Promise<boolean>;
  saveAll?(items: T[]): Promise<void>;
  count?(): Promise<number>;
}

export interface ILegacyProfileRepository extends IBaseEntityRepository<LegacyProfileSchema> {
  getByUserId(userId: string): Promise<LegacyProfileSchema[]>;
  getByCategory(category: string): Promise<LegacyProfileSchema[]>;
  search(query: string): Promise<LegacyProfileSchema[]>;
  archive(id: string): Promise<LegacyProfileSchema | null>;
  restore(id: string): Promise<LegacyProfileSchema | null>;
  updateProgress(id: string, progress: number): Promise<LegacyProfileSchema | null>;
  saveAll(items: LegacyProfileSchema[]): Promise<void>;
}

export interface IStoryRepository extends IBaseEntityRepository<StorySchema> {
  getByProfileId(profileId: string): Promise<StorySchema[]>;
  getByOwnerId(ownerId: string): Promise<StorySchema[]>;
  getByStatus(status: StorySchema['status']): Promise<StorySchema[]>;
  getByCategory(category: string): Promise<StorySchema[]>;
  search(query: string): Promise<StorySchema[]>;
  archive(id: string): Promise<StorySchema | null>;
  restore(id: string): Promise<StorySchema | null>;
  favorite(id: string, isFav: boolean): Promise<StorySchema | null>;
  pin(id: string, isPinned: boolean): Promise<StorySchema | null>;
  publish(id: string): Promise<StorySchema | null>;
  unpublish(id: string): Promise<StorySchema | null>;
  duplicate(id: string): Promise<StorySchema | null>;
  updateProgress(id: string, progress: number): Promise<StorySchema | null>;
  saveAll?(items: StorySchema[]): Promise<void>;
}

export interface IStoryChapterRepository extends IBaseEntityRepository<StoryChapterSchema> {
  getByStoryId(storyId: string): Promise<StoryChapterSchema[]>;
  reorder(storyId: string, orderedChapterIds: string[]): Promise<boolean>;
  saveAll?(items: StoryChapterSchema[]): Promise<void>;
}

export interface IStorySceneRepository extends IBaseEntityRepository<StorySceneSchema> {
  getByStoryId(storyId: string): Promise<StorySceneSchema[]>;
  getByChapterId(chapterId: string): Promise<StorySceneSchema[]>;
  reorder(chapterId: string, orderedSceneIds: string[]): Promise<boolean>;
  saveAll?(items: StorySceneSchema[]): Promise<void>;
}

export interface IMediaRepository extends IBaseEntityRepository<MediaAssetSchema> {
  getByStoryId(storyId: string): Promise<MediaAssetSchema[]>;
  getByProfileId(profileId: string): Promise<MediaAssetSchema[]>;
  getByCategory(category: string): Promise<MediaAssetSchema[]>;
  getByType(type: MediaAssetSchema['type']): Promise<MediaAssetSchema[]>;
  search(query: string): Promise<MediaAssetSchema[]>;
  archive(id: string): Promise<MediaAssetSchema | null>;
  restore(id: string): Promise<MediaAssetSchema | null>;
  favorite(id: string, isFav: boolean): Promise<MediaAssetSchema | null>;
  rename(id: string, newName: string): Promise<MediaAssetSchema | null>;
  saveAll?(items: MediaAssetSchema[]): Promise<void>;
}
