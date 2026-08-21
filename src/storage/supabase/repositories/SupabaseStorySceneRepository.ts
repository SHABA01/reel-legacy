/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';
import type { IStorySceneRepository } from '../../repositories/contracts';
import type { StorySceneSchema } from '../../schemas/schemas';
import {
  mapSceneRowToSchema,
  mapSceneSchemaToInsert,
  mapSceneSchemaToUpdate,
} from '../mappers';

export class SupabaseStorySceneRepository implements IStorySceneRepository {
  private client: SupabaseClient<Database>;

  constructor(client: SupabaseClient<Database>) {
    this.client = client;
  }

  async getAll(): Promise<StorySceneSchema[]> {
    const { data, error } = await this.client
      .from('story_scenes')
      .select('*')
      .order('scene_number', { ascending: true });

    if (error) {
      console.error('SupabaseStorySceneRepository.getAll error:', error);
      throw new Error(`Failed to fetch story scenes: ${error.message}`);
    }

    return (data || []).map(mapSceneRowToSchema);
  }

  async getById(id: string): Promise<StorySceneSchema | null> {
    const { data, error } = await this.client
      .from('story_scenes')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error(`SupabaseStorySceneRepository.getById(${id}) error:`, error);
      throw new Error(`Failed to fetch scene ${id}: ${error.message}`);
    }

    return data ? mapSceneRowToSchema(data) : null;
  }

  async getByStoryId(storyId: string): Promise<StorySceneSchema[]> {
    const { data, error } = await this.client
      .from('story_scenes')
      .select('*')
      .eq('story_id', storyId)
      .order('scene_number', { ascending: true });

    if (error) {
      console.error(`SupabaseStorySceneRepository.getByStoryId(${storyId}) error:`, error);
      throw new Error(`Failed to fetch scenes for story: ${error.message}`);
    }

    return (data || []).map(mapSceneRowToSchema);
  }

  async getByChapterId(chapterId: string): Promise<StorySceneSchema[]> {
    const { data, error } = await this.client
      .from('story_scenes')
      .select('*')
      .eq('chapter_id', chapterId)
      .order('scene_number', { ascending: true });

    if (error) {
      console.error(`SupabaseStorySceneRepository.getByChapterId(${chapterId}) error:`, error);
      throw new Error(`Failed to fetch scenes for chapter: ${error.message}`);
    }

    return (data || []).map(mapSceneRowToSchema);
  }

  async create(
    item: Omit<StorySceneSchema, 'id' | 'createdAt' | 'updatedAt' | 'schemaVersion'> & { id?: string; schemaVersion?: number }
  ): Promise<StorySceneSchema> {
    const insertPayload = mapSceneSchemaToInsert(item);

    const { data, error } = await this.client
      .from('story_scenes')
      .insert(insertPayload as any)
      .select('*')
      .single();

    if (error) {
      console.error('SupabaseStorySceneRepository.create error:', error);
      throw new Error(`Failed to create scene: ${error.message}`);
    }

    window.dispatchEvent(new Event('reellegacy-data-changed'));
    return mapSceneRowToSchema(data);
  }

  async update(id: string, updates: Partial<StorySceneSchema>): Promise<StorySceneSchema | null> {
    const updatePayload = mapSceneSchemaToUpdate(updates);

    const { data, error } = await this.client
      .from('story_scenes')
      .update(updatePayload as any)
      .eq('id', id)
      .select('*')
      .maybeSingle();

    if (error) {
      console.error(`SupabaseStorySceneRepository.update(${id}) error:`, error);
      throw new Error(`Failed to update scene: ${error.message}`);
    }

    if (data) {
      window.dispatchEvent(new Event('reellegacy-data-changed'));
      return mapSceneRowToSchema(data);
    }
    return null;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.client
      .from('story_scenes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`SupabaseStorySceneRepository.delete(${id}) error:`, error);
      throw new Error(`Failed to delete scene: ${error.message}`);
    }

    window.dispatchEvent(new Event('reellegacy-data-changed'));
    return true;
  }

  async deleteMany(ids: string[]): Promise<boolean> {
    if (!ids.length) return true;

    const { error } = await this.client
      .from('story_scenes')
      .delete()
      .in('id', ids);

    if (error) {
      console.error('SupabaseStorySceneRepository.deleteMany error:', error);
      throw new Error(`Failed to delete scenes in bulk: ${error.message}`);
    }

    window.dispatchEvent(new Event('reellegacy-data-changed'));
    return true;
  }

  async count(): Promise<number> {
    const { count, error } = await this.client
      .from('story_scenes')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('SupabaseStorySceneRepository.count error:', error);
      return 0;
    }
    return count ?? 0;
  }

  async reorder(chapterId: string, orderedSceneIds: string[]): Promise<boolean> {
    const promises = orderedSceneIds.map((sceneId, index) =>
      this.client
        .from('story_scenes')
        .update({ scene_number: index + 1 } as any)
        .eq('id', sceneId)
        .eq('chapter_id', chapterId)
    );

    const results = await Promise.all(promises);
    const hasError = results.some((r) => r.error);

    if (hasError) {
      console.error('SupabaseStorySceneRepository.reorder error');
      return false;
    }

    window.dispatchEvent(new Event('reellegacy-data-changed'));
    return true;
  }
}
