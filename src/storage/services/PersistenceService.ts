/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IStorageAdapter } from '../adapters/StorageAdapter';
import { LocalStorageAdapter } from '../adapters/LocalStorageAdapter';
import { isSupabaseConfigured, getSupabaseClient } from '../../lib/supabase';

// Repository Contracts
import {
  ILegacyProfileRepository,
  IStoryRepository,
  IStoryChapterRepository,
  IStorySceneRepository,
  IMediaRepository,
} from '../repositories/contracts';

// Local / Default Repository Implementations
import { LegacyProfileRepository } from '../repositories/LegacyProfileRepository';
import { StoryRepository } from '../repositories/StoryRepository';
import { StoryChapterRepository } from '../repositories/StoryChapterRepository';
import { StorySceneRepository } from '../repositories/StorySceneRepository';
import { MediaRepository } from '../repositories/MediaRepository';
import { TimelineRepository } from '../repositories/TimelineRepository';
import { DocumentRepository } from '../repositories/DocumentRepository';
import { CollectionRepository } from '../repositories/CollectionRepository';
import { SettingsRepository } from '../repositories/SettingsRepository';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { UserRepository } from '../repositories/UserRepository';
import { SessionRepository } from '../repositories/SessionRepository';
import { ImportRepository } from '../repositories/ImportRepository';

// Supabase Entity-Level Relational Repositories
import { SupabaseLegacyProfileRepository } from '../supabase/repositories/SupabaseLegacyProfileRepository';
import { SupabaseStoryRepository } from '../supabase/repositories/SupabaseStoryRepository';
import { SupabaseStoryChapterRepository } from '../supabase/repositories/SupabaseStoryChapterRepository';
import { SupabaseStorySceneRepository } from '../supabase/repositories/SupabaseStorySceneRepository';
import { SupabaseMediaRepository } from '../supabase/repositories/SupabaseMediaRepository';

/**
 * Central Persistence Service Registry
 * 
 * Orchestrates domain repositories with pluggable backend implementations.
 * When Supabase environment variables are provided, it initializes real
 * relational, entity-level Supabase repositories for the target domains.
 * When running in offline or local mode, it provides resilient LocalStorage repositories.
 */
export class PersistenceService {
  private static instance: PersistenceService;
  private adapter: IStorageAdapter;
  private useSupabaseIfAvailable: boolean = true;

  public profiles!: ILegacyProfileRepository;
  public stories!: IStoryRepository;
  public chapters!: IStoryChapterRepository;
  public scenes!: IStorySceneRepository;
  public media!: IMediaRepository;
  public timeline!: TimelineRepository;
  public documents!: DocumentRepository;
  public imports!: ImportRepository;
  public collections!: CollectionRepository;
  public settings!: SettingsRepository;
  public notifications!: NotificationRepository;
  public users!: UserRepository;
  public sessions!: SessionRepository;

  private constructor(adapter?: IStorageAdapter) {
    this.adapter = adapter || new LocalStorageAdapter();
    this.initializeRepositories(this.adapter);
  }

  private initializeRepositories(adapter: IStorageAdapter): void {
    this.adapter = adapter;
    const client = this.useSupabaseIfAvailable && isSupabaseConfigured() ? getSupabaseClient() : null;

    if (client) {
      // Production Relational Entity Repositories
      this.profiles = new SupabaseLegacyProfileRepository(client);
      this.stories = new SupabaseStoryRepository(client);
      this.chapters = new SupabaseStoryChapterRepository(client);
      this.scenes = new SupabaseStorySceneRepository(client);
      this.media = new SupabaseMediaRepository(client);
    } else {
      // Local Development Fallback Repositories
      this.profiles = new LegacyProfileRepository(this.adapter);
      this.stories = new StoryRepository(this.adapter);
      this.chapters = new StoryChapterRepository(this.adapter);
      this.scenes = new StorySceneRepository(this.adapter);
      this.media = new MediaRepository(this.adapter);
    }

    // Baseline Repositories (will be migrated in subsequent phases)
    this.timeline = new TimelineRepository(this.adapter);
    this.documents = new DocumentRepository(this.adapter);
    this.imports = new ImportRepository(this.adapter);
    this.collections = new CollectionRepository(this.adapter);
    this.settings = new SettingsRepository(this.adapter);
    this.notifications = new NotificationRepository(this.adapter);
    this.users = new UserRepository(this.adapter);
    this.sessions = new SessionRepository(this.adapter);
  }

  public static getInstance(customAdapter?: IStorageAdapter): PersistenceService {
    if (!PersistenceService.instance) {
      PersistenceService.instance = new PersistenceService(customAdapter);
    } else if (customAdapter && PersistenceService.instance.adapter !== customAdapter) {
      PersistenceService.instance.setAdapter(customAdapter);
    }
    return PersistenceService.instance;
  }

  public setAdapter(adapter: IStorageAdapter): void {
    this.initializeRepositories(adapter);
  }

  public getAdapter(): IStorageAdapter {
    return this.adapter;
  }

  public isUsingSupabase(): boolean {
    return this.useSupabaseIfAvailable && isSupabaseConfigured();
  }

  public setUseSupabase(use: boolean): void {
    this.useSupabaseIfAvailable = use;
    this.initializeRepositories(this.adapter);
  }

  public async clearAll(): Promise<void> {
    await this.adapter.clear();
  }
}

export const persistenceService = PersistenceService.getInstance();
