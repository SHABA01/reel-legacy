/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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

export class PersistenceService {
  private static instance: PersistenceService;
  private adapter: LocalStorageAdapter;

  public profiles: LegacyProfileRepository;
  public stories: StoryRepository;
  public media: MediaRepository;
  public timeline: TimelineRepository;
  public documents: DocumentRepository;
  public imports: ImportRepository;
  public collections: CollectionRepository;
  public settings: SettingsRepository;
  public notifications: NotificationRepository;
  public users: UserRepository;
  public sessions: SessionRepository;

  private constructor() {
    this.adapter = new LocalStorageAdapter();
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

  public static getInstance(): PersistenceService {
    if (!PersistenceService.instance) {
      PersistenceService.instance = new PersistenceService();
    }
    return PersistenceService.instance;
  }

  public async clearAll(): Promise<void> {
    await this.adapter.clear();
  }
}

export const persistenceService = PersistenceService.getInstance();
