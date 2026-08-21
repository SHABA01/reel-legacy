/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';
import type { IMediaRepository } from '../../repositories/contracts';
import type { MediaAssetSchema } from '../../schemas/schemas';
import {
  mapMediaRowToSchema,
  mapMediaSchemaToInsert,
  mapMediaSchemaToUpdate,
} from '../mappers';

export class SupabaseMediaRepository implements IMediaRepository {
  private client: SupabaseClient<Database>;

  constructor(client: SupabaseClient<Database>) {
    this.client = client;
  }

  async getAll(): Promise<MediaAssetSchema[]> {
    const { data, error } = await this.client
      .from('media_assets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('SupabaseMediaRepository.getAll error:', error);
      throw new Error(`Failed to fetch media assets: ${error.message}`);
    }

    return (data || []).map(mapMediaRowToSchema);
  }

  async getById(id: string): Promise<MediaAssetSchema | null> {
    const { data, error } = await this.client
      .from('media_assets')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error(`SupabaseMediaRepository.getById(${id}) error:`, error);
      throw new Error(`Failed to fetch media asset ${id}: ${error.message}`);
    }

    return data ? mapMediaRowToSchema(data) : null;
  }

  async getByStoryId(storyId: string): Promise<MediaAssetSchema[]> {
    const { data, error } = await this.client
      .from('media_assets')
      .select('*')
      .eq('linked_story_id', storyId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`SupabaseMediaRepository.getByStoryId(${storyId}) error:`, error);
      throw new Error(`Failed to fetch media assets for story: ${error.message}`);
    }

    return (data || []).map(mapMediaRowToSchema);
  }

  async getByProfileId(profileId: string): Promise<MediaAssetSchema[]> {
    const { data, error } = await this.client
      .from('media_assets')
      .select('*')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`SupabaseMediaRepository.getByProfileId(${profileId}) error:`, error);
      throw new Error(`Failed to fetch media assets for profile: ${error.message}`);
    }

    return (data || []).map(mapMediaRowToSchema);
  }

  async getByCategory(category: string): Promise<MediaAssetSchema[]> {
    const { data, error } = await this.client
      .from('media_assets')
      .select('*')
      .contains('categories', [category])
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`SupabaseMediaRepository.getByCategory error:`, error);
      throw new Error(`Failed to fetch media by category: ${error.message}`);
    }

    return (data || []).map(mapMediaRowToSchema);
  }

  async getByType(type: MediaAssetSchema['type']): Promise<MediaAssetSchema[]> {
    const { data, error } = await this.client
      .from('media_assets')
      .select('*')
      .eq('media_type', type as any)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`SupabaseMediaRepository.getByType error:`, error);
      throw new Error(`Failed to fetch media by type: ${error.message}`);
    }

    return (data || []).map(mapMediaRowToSchema);
  }

  async search(query: string): Promise<MediaAssetSchema[]> {
    const trimmed = query.trim();
    if (!trimmed) return this.getAll();

    const { data, error } = await this.client
      .from('media_assets')
      .select('*')
      .or(`name.ilike.%${trimmed}%,display_name.ilike.%${trimmed}%,description.ilike.%${trimmed}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`SupabaseMediaRepository.search error:`, error);
      throw new Error(`Failed to search media assets: ${error.message}`);
    }

    return (data || []).map(mapMediaRowToSchema);
  }

  async create(
    item: Omit<MediaAssetSchema, 'id' | 'createdAt' | 'updatedAt' | 'schemaVersion'> & { id?: string; schemaVersion?: number }
  ): Promise<MediaAssetSchema> {
    const insertPayload = mapMediaSchemaToInsert(item);

    const { data, error } = await this.client
      .from('media_assets')
      .insert(insertPayload as any)
      .select('*')
      .single();

    if (error) {
      console.error('SupabaseMediaRepository.create error:', error);
      throw new Error(`Failed to create media asset: ${error.message}`);
    }

    window.dispatchEvent(new Event('reellegacy-data-changed'));
    return mapMediaRowToSchema(data);
  }

  async update(id: string, updates: Partial<MediaAssetSchema>): Promise<MediaAssetSchema | null> {
    const updatePayload = mapMediaSchemaToUpdate(updates);

    const { data, error } = await this.client
      .from('media_assets')
      .update(updatePayload as any)
      .eq('id', id)
      .select('*')
      .maybeSingle();

    if (error) {
      console.error(`SupabaseMediaRepository.update(${id}) error:`, error);
      throw new Error(`Failed to update media asset: ${error.message}`);
    }

    if (data) {
      window.dispatchEvent(new Event('reellegacy-data-changed'));
      return mapMediaRowToSchema(data);
    }
    return null;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.client
      .from('media_assets')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`SupabaseMediaRepository.delete(${id}) error:`, error);
      throw new Error(`Failed to delete media asset: ${error.message}`);
    }

    window.dispatchEvent(new Event('reellegacy-data-changed'));
    return true;
  }

  async deleteMany(ids: string[]): Promise<boolean> {
    if (!ids.length) return true;

    const { error } = await this.client
      .from('media_assets')
      .delete()
      .in('id', ids);

    if (error) {
      console.error('SupabaseMediaRepository.deleteMany error:', error);
      throw new Error(`Failed to delete media assets in bulk: ${error.message}`);
    }

    window.dispatchEvent(new Event('reellegacy-data-changed'));
    return true;
  }

  async count(): Promise<number> {
    const { count, error } = await this.client
      .from('media_assets')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('SupabaseMediaRepository.count error:', error);
      return 0;
    }
    return count ?? 0;
  }

  async archive(id: string): Promise<MediaAssetSchema | null> {
    return this.update(id, { archived: true });
  }

  async restore(id: string): Promise<MediaAssetSchema | null> {
    return this.update(id, { archived: false });
  }

  async favorite(id: string, isFav: boolean): Promise<MediaAssetSchema | null> {
    return this.update(id, { favorite: isFav });
  }

  async rename(id: string, newName: string): Promise<MediaAssetSchema | null> {
    return this.update(id, { name: newName, displayName: newName });
  }
}
