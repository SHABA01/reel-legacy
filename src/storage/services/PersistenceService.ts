/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IStorageAdapter, StorageAdapter } from '../adapters/StorageAdapter';
import { LocalStorageAdapter } from '../adapters/LocalStorageAdapter';
import { LegacyProfileRepository } from '../repositories/LegacyProfileRepository';
import { StoryRepository } from '../repositories/StoryRepository';
import { MediaRepository } from '../repositories/MediaRepository';
import { TimelineRepository } from '../repositories/TimelineRepository';
import { DocumentRepository } from '../repositories/DocumentRepository';
import { CollectionRepository } from '../repositories/CollectionRepository';
import { SettingsRepository } from '../repositories/SettingsRepository';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { UserRepository } from '../repositories/UserRepository';
import { SessionRepository } from '../repositories/SessionRepository';
import { ImportRepository } from '../repositories/ImportRepository';

/**
 * Central Persistence Service Registry
 * 
 * Orchestrates domain repositories with pluggable storage adapters
 * (LocalStorageAdapter, RemoteApiAdapter, etc.) without altering
 * downstream service contracts or component interfaces.
 */
export class PersistenceService {
  private static instance: PersistenceService;
  private adapter: IStorageAdapter;

  public profiles!: LegacyProfileRepository;
  public stories!: StoryRepository;
  public media!: MediaRepository;
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
    this.profiles = new LegacyProfileRepository(this.adapter);
    this.stories = new StoryRepository(this.adapter);
    this.media = new MediaRepository(this.adapter);
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

  public async clearAll(): Promise<void> {
    await this.adapter.clear();
  }
}

export const persistenceService = PersistenceService.getInstance();
