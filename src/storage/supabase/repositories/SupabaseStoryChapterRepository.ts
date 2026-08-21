/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';
import type { IStoryChapterRepository } from '../../repositories/contracts';
import type { StoryChapterSchema } from '../../schemas/schemas';
import {
  mapChapterRowToSchema,
  mapChapterSchemaToInsert,
  mapChapterSchemaToUpdate,
} from '../mappers';

export class SupabaseStoryChapterRepository implements IStoryChapterRepository {
  private client: SupabaseClient<Database>;

  constructor(client: SupabaseClient<Database>) {
    this.client = client;
  }

  async getAll(): Promise<StoryChapterSchema[]> {
    const { data, error } = await this.client
      .from('story_chapters')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      console.error('SupabaseStoryChapterRepository.getAll error:', error);
      throw new Error(`Failed to fetch story chapters: ${error.message}`);
    }

    return (data || []).map(mapChapterRowToSchema);
  }

  async getById(id: string): Promise<StoryChapterSchema | null> {
    const { data, error } = await this.client
      .from('story_chapters')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error(`SupabaseStoryChapterRepository.getById(${id}) error:`, error);
      throw new Error(`Failed to fetch chapter ${id}: ${error.message}`);
    }

    return data ? mapChapterRowToSchema(data) : null;
  }

  async getByStoryId(storyId: string): Promise<StoryChapterSchema[]> {
    const { data, error } = await this.client
      .from('story_chapters')
      .select('*')
      .eq('story_id', storyId)
      .order('order_index', { ascending: true });

    if (error) {
      console.error(`SupabaseStoryChapterRepository.getByStoryId(${storyId}) error:`, error);
      throw new Error(`Failed to fetch chapters for story: ${error.message}`);
    }

    return (data || []).map(mapChapterRowToSchema);
  }

  async create(
    item: Omit<StoryChapterSchema, 'id' | 'createdAt' | 'updatedAt' | 'schemaVersion'> & { id?: string; schemaVersion?: number }
  ): Promise<StoryChapterSchema> {
    const insertPayload = mapChapterSchemaToInsert(item);

    const { data, error } = await this.client
      .from('story_chapters')
      .insert(insertPayload as any)
      .select('*')
      .single();

    if (error) {
      console.error('SupabaseStoryChapterRepository.create error:', error);
      throw new Error(`Failed to create chapter: ${error.message}`);
    }

    window.dispatchEvent(new Event('reellegacy-data-changed'));
    return mapChapterRowToSchema(data);
  }

  async update(id: string, updates: Partial<StoryChapterSchema>): Promise<StoryChapterSchema | null> {
    const updatePayload = mapChapterSchemaToUpdate(updates);

    const { data, error } = await this.client
      .from('story_chapters')
      .update(updatePayload as any)
      .eq('id', id)
      .select('*')
      .maybeSingle();

    if (error) {
      console.error(`SupabaseStoryChapterRepository.update(${id}) error:`, error);
      throw new Error(`Failed to update chapter: ${error.message}`);
    }

    if (data) {
      window.dispatchEvent(new Event('reellegacy-data-changed'));
      return mapChapterRowToSchema(data);
    }
    return null;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.client
      .from('story_chapters')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`SupabaseStoryChapterRepository.delete(${id}) error:`, error);
      throw new Error(`Failed to delete chapter: ${error.message}`);
    }

    window.dispatchEvent(new Event('reellegacy-data-changed'));
    return true;
  }

  async deleteMany(ids: string[]): Promise<boolean> {
    if (!ids.length) return true;

    const { error } = await this.client
      .from('story_chapters')
      .delete()
      .in('id', ids);

    if (error) {
      console.error('SupabaseStoryChapterRepository.deleteMany error:', error);
      throw new Error(`Failed to delete chapters in bulk: ${error.message}`);
    }

    window.dispatchEvent(new Event('reellegacy-data-changed'));
    return true;
  }

  async count(): Promise<number> {
    const { count, error } = await this.client
      .from('story_chapters')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('SupabaseStoryChapterRepository.count error:', error);
      return 0;
    }
    return count ?? 0;
  }

  async reorder(storyId: string, orderedChapterIds: string[]): Promise<boolean> {
    const promises = orderedChapterIds.map((chapterId, index) =>
      this.client
        .from('story_chapters')
        .update({ order_index: index } as any)
        .eq('id', chapterId)
        .eq('story_id', storyId)
    );

    const results = await Promise.all(promises);
    const hasError = results.some((r) => r.error);

    if (hasError) {
      console.error('SupabaseStoryChapterRepository.reorder error');
      return false;
    }

    window.dispatchEvent(new Event('reellegacy-data-changed'));
    return true;
  }
}
