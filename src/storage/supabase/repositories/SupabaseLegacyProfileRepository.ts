/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';
import type { ILegacyProfileRepository } from '../../repositories/contracts';
import type { LegacyProfileSchema } from '../../schemas/schemas';
import {
  mapProfileRowToSchema,
  mapProfileSchemaToInsert,
  mapProfileSchemaToUpdate,
} from '../mappers';

export class SupabaseLegacyProfileRepository implements ILegacyProfileRepository {
  private client: SupabaseClient<Database>;

  constructor(client: SupabaseClient<Database>) {
    this.client = client;
  }

  async getAll(): Promise<LegacyProfileSchema[]> {
    const { data, error } = await this.client
      .from('legacy_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('SupabaseLegacyProfileRepository.getAll error:', error);
      throw new Error(`Failed to fetch legacy profiles: ${error.message}`);
    }

    return (data || []).map(mapProfileRowToSchema);
  }

  async getById(id: string): Promise<LegacyProfileSchema | null> {
    const { data, error } = await this.client
      .from('legacy_profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error(`SupabaseLegacyProfileRepository.getById(${id}) error:`, error);
      throw new Error(`Failed to fetch legacy profile ${id}: ${error.message}`);
    }

    return data ? mapProfileRowToSchema(data) : null;
  }

  async getByUserId(userId: string): Promise<LegacyProfileSchema[]> {
    const { data, error } = await this.client
      .from('legacy_profiles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`SupabaseLegacyProfileRepository.getByUserId error:`, error);
      throw new Error(`Failed to fetch profiles for user: ${error.message}`);
    }

    return (data || []).map(mapProfileRowToSchema);
  }

  async getByCategory(category: string): Promise<LegacyProfileSchema[]> {
    const { data, error } = await this.client
      .from('legacy_profiles')
      .select('*')
      .eq('category', category as any)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`SupabaseLegacyProfileRepository.getByCategory error:`, error);
      throw new Error(`Failed to fetch profiles by category: ${error.message}`);
    }

    return (data || []).map(mapProfileRowToSchema);
  }

  async search(query: string): Promise<LegacyProfileSchema[]> {
    const trimmed = query.trim();
    if (!trimmed) return this.getAll();

    const { data, error } = await this.client
      .from('legacy_profiles')
      .select('*')
      .or(
        `first_name.ilike.%${trimmed}%,last_name.ilike.%${trimmed}%,preferred_name.ilike.%${trimmed}%,biography_summary.ilike.%${trimmed}%`
      )
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`SupabaseLegacyProfileRepository.search error:`, error);
      throw new Error(`Failed to search legacy profiles: ${error.message}`);
    }

    return (data || []).map(mapProfileRowToSchema);
  }

  async create(
    item: Omit<LegacyProfileSchema, 'id' | 'createdAt' | 'updatedAt' | 'schemaVersion'> & { id?: string; schemaVersion?: number }
  ): Promise<LegacyProfileSchema> {
    const insertPayload = mapProfileSchemaToInsert(item);

    const { data, error } = await this.client
      .from('legacy_profiles')
      .insert(insertPayload as any)
      .select('*')
      .single();

    if (error) {
      console.error('SupabaseLegacyProfileRepository.create error:', error);
      throw new Error(`Failed to create legacy profile: ${error.message}`);
    }

    window.dispatchEvent(new Event('reellegacy-data-changed'));
    return mapProfileRowToSchema(data);
  }

  async update(id: string, updates: Partial<LegacyProfileSchema>): Promise<LegacyProfileSchema | null> {
    const updatePayload = mapProfileSchemaToUpdate(updates);

    const { data, error } = await this.client
      .from('legacy_profiles')
      .update(updatePayload as any)
      .eq('id', id)
      .select('*')
      .maybeSingle();

    if (error) {
      console.error(`SupabaseLegacyProfileRepository.update(${id}) error:`, error);
      throw new Error(`Failed to update legacy profile: ${error.message}`);
    }

    if (data) {
      window.dispatchEvent(new Event('reellegacy-data-changed'));
      return mapProfileRowToSchema(data);
    }
    return null;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.client
      .from('legacy_profiles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`SupabaseLegacyProfileRepository.delete(${id}) error:`, error);
      throw new Error(`Failed to delete legacy profile: ${error.message}`);
    }

    window.dispatchEvent(new Event('reellegacy-data-changed'));
    return true;
  }

  async deleteMany(ids: string[]): Promise<boolean> {
    if (!ids.length) return true;

    const { error } = await this.client
      .from('legacy_profiles')
      .delete()
      .in('id', ids);

    if (error) {
      console.error(`SupabaseLegacyProfileRepository.deleteMany error:`, error);
      throw new Error(`Failed to delete profiles in bulk: ${error.message}`);
    }

    window.dispatchEvent(new Event('reellegacy-data-changed'));
    return true;
  }

  async saveAll(items: LegacyProfileSchema[]): Promise<void> {
    if (!items.length) return;
    const insertPayloads = items.map(mapProfileSchemaToInsert);

    const { error } = await this.client
      .from('legacy_profiles')
      .upsert(insertPayloads as any);

    if (error) {
      console.error('SupabaseLegacyProfileRepository.saveAll error:', error);
      throw new Error(`Failed to batch save profiles: ${error.message}`);
    }

    window.dispatchEvent(new Event('reellegacy-data-changed'));
  }

  async count(): Promise<number> {
    const { count, error } = await this.client
      .from('legacy_profiles')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('SupabaseLegacyProfileRepository.count error:', error);
      return 0;
    }
    return count ?? 0;
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
