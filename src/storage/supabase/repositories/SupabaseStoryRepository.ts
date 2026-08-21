/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';
import type { IStoryRepository } from '../../repositories/contracts';
import type { StorySchema } from '../../schemas/schemas';
import {
  mapStoryRowToSchema,
  mapStorySchemaToInsert,
  mapStorySchemaToUpdate,
} from '../mappers';

export class SupabaseStoryRepository implements IStoryRepository {
  private client: SupabaseClient<Database>;

  constructor(client: SupabaseClient<Database>) {
    this.client = client;
  }

  async getAll(): Promise<StorySchema[]> {
    const { data, error } = await this.client
      .from('stories')
      .select('*')
      .order('last_edited', { ascending: false });

    if (error) {
      console.error('SupabaseStoryRepository.getAll error:', error);
      throw new Error(`Failed to fetch stories: ${error.message}`);
    }

    return (data || []).map(mapStoryRowToSchema);
  }

  async getById(id: string): Promise<StorySchema | null> {
    const { data, error } = await this.client
      .from('stories')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error(`SupabaseStoryRepository.getById(${id}) error:`, error);
      throw new Error(`Failed to fetch story ${id}: ${error.message}`);
    }

    return data ? mapStoryRowToSchema(data) : null;
  }

  async getByProfileId(profileId: string): Promise<StorySchema[]> {
    const { data, error } = await this.client
      .from('stories')
      .select('*')
      .eq('profile_id', profileId)
      .order('last_edited', { ascending: false });

    if (error) {
      console.error(`SupabaseStoryRepository.getByProfileId error:`, error);
      throw new Error(`Failed to fetch stories for profile: ${error.message}`);
    }

    return (data || []).map(mapStoryRowToSchema);
  }

  async getByOwnerId(ownerId: string): Promise<StorySchema[]> {
    const { data, error } = await this.client
      .from('stories')
      .select('*')
      .eq('user_id', ownerId)
      .order('last_edited', { ascending: false });

    if (error) {
      console.error(`SupabaseStoryRepository.getByOwnerId error:`, error);
      throw new Error(`Failed to fetch stories by owner: ${error.message}`);
    }

    return (data || []).map(mapStoryRowToSchema);
  }

  async getByStatus(status: StorySchema['status']): Promise<StorySchema[]> {
    const dbStatusMap: Record<string, string> = {
      Draft: 'draft',
      'In Progress': 'in_progress',
      Review: 'review',
      'Ready to Render': 'ready_to_render',
      Rendering: 'rendering',
      Published: 'published',
      Archived: 'archived',
    };
    const mapped = dbStatusMap[status] || status.toLowerCase();

    const { data, error } = await this.client
      .from('stories')
      .select('*')
      .eq('status', mapped as any)
      .order('last_edited', { ascending: false });

    if (error) {
      console.error(`SupabaseStoryRepository.getByStatus error:`, error);
      throw new Error(`Failed to fetch stories by status: ${error.message}`);
    }

    return (data || []).map(mapStoryRowToSchema);
  }

  async getByCategory(category: string): Promise<StorySchema[]> {
    const { data, error } = await this.client
      .from('stories')
      .select('*')
      .eq('category', category)
      .order('last_edited', { ascending: false });

    if (error) {
      console.error(`SupabaseStoryRepository.getByCategory error:`, error);
      throw new Error(`Failed to fetch stories by category: ${error.message}`);
    }

    return (data || []).map(mapStoryRowToSchema);
  }

  async search(query: string): Promise<StorySchema[]> {
    const trimmed = query.trim();
    if (!trimmed) return this.getAll();

    const { data, error } = await this.client
      .from('stories')
      .select('*')
      .or(`title.ilike.%${trimmed}%,subtitle.ilike.%${trimmed}%,description.ilike.%${trimmed}%`)
      .order('last_edited', { ascending: false });

    if (error) {
      console.error(`SupabaseStoryRepository.search error:`, error);
      throw new Error(`Failed to search stories: ${error.message}`);
    }

    return (data || []).map(mapStoryRowToSchema);
  }

  async create(
    item: Omit<StorySchema, 'id' | 'createdAt' | 'updatedAt' | 'schemaVersion'> & { id?: string; schemaVersion?: number }
  ): Promise<StorySchema> {
    const insertPayload = mapStorySchemaToInsert(item);

    const { data, error } = await this.client
      .from('stories')
      .insert(insertPayload as any)
      .select('*')
      .single();

    if (error) {
      console.error('SupabaseStoryRepository.create error:', error);
      throw new Error(`Failed to create story: ${error.message}`);
    }

    window.dispatchEvent(new Event('reellegacy-data-changed'));
    return mapStoryRowToSchema(data);
  }

  async update(id: string, updates: Partial<StorySchema>): Promise<StorySchema | null> {
    const updatePayload = mapStorySchemaToUpdate(updates);

    const { data, error } = await this.client
      .from('stories')
      .update(updatePayload as any)
      .eq('id', id)
      .select('*')
      .maybeSingle();

    if (error) {
      console.error(`SupabaseStoryRepository.update(${id}) error:`, error);
      throw new Error(`Failed to update story: ${error.message}`);
    }

    if (data) {
      window.dispatchEvent(new Event('reellegacy-data-changed'));
      return mapStoryRowToSchema(data);
    }
    return null;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.client
      .from('stories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`SupabaseStoryRepository.delete(${id}) error:`, error);
      throw new Error(`Failed to delete story: ${error.message}`);
    }

    window.dispatchEvent(new Event('reellegacy-data-changed'));
    return true;
  }

  async deleteMany(ids: string[]): Promise<boolean> {
    if (!ids.length) return true;

    const { error } = await this.client
      .from('stories')
      .delete()
      .in('id', ids);

    if (error) {
      console.error('SupabaseStoryRepository.deleteMany error:', error);
      throw new Error(`Failed to delete stories in bulk: ${error.message}`);
    }

    window.dispatchEvent(new Event('reellegacy-data-changed'));
    return true;
  }

  async duplicate(id: string): Promise<StorySchema | null> {
    const original = await this.getById(id);
    if (!original) return null;

    const dupData: Omit<StorySchema, 'id' | 'createdAt' | 'updatedAt' | 'schemaVersion'> = {
      ...original,
      title: `${original.title} (Copy)`,
      subtitle: original.subtitle ? `${original.subtitle} (Copy)` : 'Copy',
      status: 'Draft',
      completionProgress: 15,
      pinned: false,
      favorite: false,
      lastEdited: new Date().toISOString(),
      lastGenerated: null,
    };

    return this.create(dupData);
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

  async count(): Promise<number> {
    const { count, error } = await this.client
      .from('stories')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('SupabaseStoryRepository.count error:', error);
      return 0;
    }
    return count ?? 0;
  }
}
