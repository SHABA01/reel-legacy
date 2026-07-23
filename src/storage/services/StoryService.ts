/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { persistenceService } from './PersistenceService';
import { StorySchema } from '../schemas/schemas';
import { ValidationService } from './ValidationService';
import { ActivityService } from './ActivityService';

export class StoryService {
  /**
   * Validates a story.
   */
  static validate(story: { title: string; description: string; associatedProfileId: string; category?: string; tags?: string[] }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!story.title || !story.title.trim()) {
      errors.push('Missing Title: A title is required to create a Story.');
    } else if (story.title.length > 80) {
      errors.push('Story title cannot exceed 80 characters.');
    }
    
    if (!story.associatedProfileId) {
      errors.push('Legacy Profile Selected: You must select exactly one associated Legacy Profile.');
    }

    if (story.category && !story.category.trim()) {
      errors.push('Invalid Story Type: Story type cannot be empty.');
    }

    if (story.tags && story.tags.some(t => !t || !t.trim())) {
      errors.push('Invalid Tags: Tags cannot contain empty values.');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Automatically calculates story completeness percentage.
   */
  static calculateProgress(story: Partial<StorySchema>): number {
    let score = 0;
    const maxScore = 100;

    // Weight allocations (10 weights of 10% each)
    if (story.title && story.title.trim()) score += 10;
    if (story.subtitle && story.subtitle.trim()) score += 10;
    if (story.description && story.description.trim()) score += 10;
    if (story.summary && story.summary.trim()) score += 10;
    if (story.theme && story.theme.trim()) score += 10;
    if (story.mood && story.mood.trim()) score += 10;
    if (story.narrativeStyle && story.narrativeStyle.trim()) score += 10;
    if (story.primaryLanguage && story.primaryLanguage.trim()) score += 10;
    if (story.coverImage && story.coverImage.trim()) score += 10;
    if (story.associatedProfileId) score += 10;

    return Math.min(score, maxScore);
  }

  /**
   * Creates a new user story.
   */
  static async createStory(data: Omit<StorySchema, 'id' | 'createdAt' | 'updatedAt' | 'schemaVersion' | 'completionProgress'> & { id?: string }): Promise<StorySchema> {
    const validation = this.validate({
      title: data.title,
      description: data.description,
      associatedProfileId: data.associatedProfileId,
      category: data.category,
      tags: data.tags
    });

    if (!validation.isValid) {
      throw new Error(validation.errors.join(' '));
    }

    const completionProgress = this.calculateProgress(data);

    const story = await persistenceService.stories.create({
      ...data,
      completionProgress,
      schemaVersion: 1,
      lastEdited: new Date().toISOString()
    });

    // Prepare integration points
    this.triggerIntegrationNotification('create', story);

    return story;
  }

  /**
   * Updates an existing story.
   */
  static async updateStory(id: string, updates: Partial<StorySchema>): Promise<StorySchema> {
    const existing = await persistenceService.stories.getById(id);
    if (!existing) {
      throw new Error(`Story with ID ${id} not found.`);
    }

    // Merge updates and recalculate completionProgress
    const merged = { ...existing, ...updates };
    const completionProgress = this.calculateProgress(merged);

    const updated = await persistenceService.stories.update(id, {
      ...updates,
      completionProgress,
      lastEdited: new Date().toISOString()
    });

    if (!updated) {
      throw new Error(`Failed to update Story with ID ${id}.`);
    }

    this.triggerIntegrationNotification('update', updated);

    return updated;
  }

  /**
   * Permanently deletes a story.
   */
  static async deleteStory(id: string): Promise<boolean> {
    const existing = await persistenceService.stories.getById(id);
    if (!existing) return false;

    const deleted = await persistenceService.stories.delete(id);
    if (deleted) {
      this.triggerIntegrationNotification('delete', existing);
    }
    return deleted;
  }

  /**
   * Permanently deletes multiple stories in bulk.
   */
  static async deleteStories(ids: string[]): Promise<boolean> {
    const deleted = await persistenceService.stories.deleteMany(ids);
    if (deleted) {
      window.dispatchEvent(new Event('reellegacy-data-changed'));
    }
    return deleted;
  }

  /**
   * Clones / duplicates a story.
   */
  static async duplicateStory(id: string): Promise<StorySchema> {
    const existing = await persistenceService.stories.getById(id);
    if (!existing) {
      throw new Error(`Story with ID ${id} not found.`);
    }

    const duplicated = await persistenceService.stories.duplicate(id);
    if (!duplicated) {
      throw new Error(`Failed to duplicate story with ID ${id}.`);
    }

    this.triggerIntegrationNotification('duplicate', duplicated);

    return duplicated;
  }

  /**
   * Archives a story.
   */
  static async archiveStory(id: string): Promise<StorySchema> {
    const updated = await persistenceService.stories.archive(id);
    if (!updated) throw new Error('Story not found.');
    this.triggerIntegrationNotification('archive', updated);
    return updated;
  }

  /**
   * Restores an archived story.
   */
  static async restoreStory(id: string): Promise<StorySchema> {
    const updated = await persistenceService.stories.restore(id);
    if (!updated) throw new Error('Story not found.');
    this.triggerIntegrationNotification('restore', updated);
    return updated;
  }

  /**
   * Favorites or unfavorites a story.
   */
  static async favoriteStory(id: string, isFav: boolean): Promise<StorySchema> {
    const updated = await persistenceService.stories.favorite(id, isFav);
    if (!updated) throw new Error('Story not found.');
    this.triggerIntegrationNotification('favorite', updated);
    return updated;
  }

  /**
   * Pins or unpins a story.
   */
  static async pinStory(id: string, isPinned: boolean): Promise<StorySchema> {
    const updated = await persistenceService.stories.pin(id, isPinned);
    if (!updated) throw new Error('Story not found.');
    this.triggerIntegrationNotification('pin', updated);
    return updated;
  }

  /**
   * Publishes a story (local state).
   */
  static async publishStory(id: string): Promise<StorySchema> {
    const updated = await persistenceService.stories.publish(id);
    if (!updated) throw new Error('Story not found.');
    this.triggerIntegrationNotification('publish', updated);
    return updated;
  }

  /**
   * Unpublishes a story.
   */
  static async unpublishStory(id: string): Promise<StorySchema> {
    const updated = await persistenceService.stories.unpublish(id);
    if (!updated) throw new Error('Story not found.');
    this.triggerIntegrationNotification('unpublish', updated);
    return updated;
  }

  /**
   * Retrieves dashboard statistics.
   */
  static async getStatistics(userId?: string): Promise<{
    total: number;
    draft: number;
    published: number;
    archived: number;
    favorite: number;
    avgProgress: number;
    recentlyUpdated: StorySchema[];
  }> {
    let items = await persistenceService.stories.getAll();
    if (userId) {
      items = items.filter(item => item.ownerId === userId);
    }

    const total = items.length;
    const draft = items.filter(s => s.status === 'Draft').length;
    const published = items.filter(s => s.status === 'Published').length;
    const archived = items.filter(s => s.status === 'Archived').length;
    const favorite = items.filter(s => s.favorite).length;

    const activeItems = items.filter(s => s.status !== 'Archived');
    const totalProgress = activeItems.reduce((sum, s) => sum + (s.completionProgress || 0), 0);
    const avgProgress = activeItems.length > 0 ? Math.round(totalProgress / activeItems.length) : 0;

    const recentlyUpdated = [...items]
      .sort((a, b) => new Date(b.lastEdited || b.updatedAt).getTime() - new Date(a.lastEdited || a.updatedAt).getTime())
      .slice(0, 5);

    return {
      total,
      draft,
      published,
      archived,
      favorite,
      avgProgress,
      recentlyUpdated
    };
  }

  /**
   * Integration Hooks (Preparations for future Timeline, Media, AI Story Generation, etc.)
   */
  private static triggerIntegrationNotification(action: string, story: StorySchema) {
    console.log(`[F4-StoryIntegration] Story "${story.title}" was subject to action "${action}".`);
    
    // Log dynamic activity
    if (action === 'create') {
      ActivityService.logActivity(
        'Story Created',
        `Story "${story.title}" has been successfully drafted.`,
        'bg-emerald-500'
      ).catch(err => console.warn('Failed to log story creation activity', err));
    } else if (action === 'update') {
      ActivityService.logActivity(
        'Story Updated',
        `Story "${story.title}" has been updated.`,
        'bg-indigo-500'
      ).catch(err => console.warn('Failed to log story update activity', err));
    }

    // Future Notification integration
    if (persistenceService.notifications) {
      persistenceService.notifications.create({
        title: `Story ${action.toUpperCase()}`,
        message: `Your story "${story.title}" has been successfully ${action}ed.`,
        type: 'info',
        read: false,
        schemaVersion: 1
      }).catch(err => console.warn('Failed to dispatch background notification', err));
    }

    // Future Timeline indexer preparation hook
    // Future Media pipeline optimization hook
    // Future AI Narrative preparation hook
    // Future Video Rendering preparation hook
  }
}
