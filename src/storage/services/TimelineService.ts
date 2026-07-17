/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { persistenceService } from './PersistenceService';
import { TimelineEventSchema } from '../schemas/schemas';
import { ActivityService } from './ActivityService';

export class TimelineService {
  /**
   * Validates a timeline event.
   */
  static async validate(event: Partial<TimelineEventSchema>): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (!event.title || !event.title.trim()) {
      errors.push('Missing Title: A title is required to create a Timeline Event.');
    } else if (event.title.length > 100) {
      errors.push('Event title cannot exceed 100 characters.');
    }

    if (!event.year || !event.year.trim()) {
      errors.push('Missing Year: A year is required to position the event on the timeline.');
    } else {
      const parsedYear = parseInt(event.year);
      if (isNaN(parsedYear) || parsedYear < 1000 || parsedYear > 2100) {
        errors.push('Invalid Year: Please enter a valid 4-digit year (e.g. 1974).');
      }
    }

    if (!event.profileId) {
      errors.push('Missing Legacy Profile: The event must be associated with exactly one Legacy Profile.');
    } else {
      const profile = await persistenceService.profiles.getById(event.profileId);
      if (!profile) {
        errors.push('Invalid Legacy Profile: The selected profile does not exist.');
      }
    }

    if (event.storyId) {
      const story = await persistenceService.stories.getById(event.storyId);
      if (!story) {
        errors.push('Invalid Story: The selected story does not exist.');
      }
    }

    if (!event.category || !event.category.trim()) {
      errors.push('Missing Event Type: An event type or category is required.');
    }

    // Check Start Date / End Date logic
    if (event.startDate && event.endDate) {
      const start = new Date(event.startDate).getTime();
      const end = new Date(event.endDate).getTime();
      if (!isNaN(start) && !isNaN(end) && end < start) {
        errors.push('Date Sequence Conflict: End date cannot be chronologically before the start date.');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Automatically calculates event data completeness percentage (out of 100).
   */
  static calculateProgress(event: Partial<TimelineEventSchema>): number {
    let score = 0;
    const maxScore = 100;

    // Weight allocation (10 weights of 10% each)
    if (event.title && event.title.trim()) score += 10;
    if (event.subtitle && event.subtitle.trim()) score += 10;
    if (event.description && event.description.trim()) score += 10;
    if (event.year && event.year.trim()) score += 10;
    if (event.category && event.category.trim()) score += 10;
    if (event.location && event.location.trim()) score += 10;
    if (event.importance) score += 10;
    if (event.profileId) score += 10;
    if (event.storyId) score += 10;
    if (event.mediaIds && event.mediaIds.length > 0) score += 10;

    return Math.min(score, maxScore);
  }

  /**
   * Creates a new timeline event.
   */
  static async createEvent(data: Omit<TimelineEventSchema, 'id' | 'createdAt' | 'updatedAt' | 'schemaVersion'> & { id?: string }): Promise<TimelineEventSchema> {
    const validation = await this.validate(data);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(' '));
    }

    // Assign sortOrder based on count
    const count = await persistenceService.timeline.count();
    
    const event = await persistenceService.timeline.create({
      ...data,
      sortOrder: data.sortOrder !== undefined ? data.sortOrder : count,
      schemaVersion: 1
    });

    this.triggerIntegrationNotification('create', event);
    return event;
  }

  /**
   * Updates an existing timeline event.
   */
  static async updateEvent(id: string, updates: Partial<TimelineEventSchema>): Promise<TimelineEventSchema> {
    const existing = await persistenceService.timeline.getById(id);
    if (!existing) {
      throw new Error(`Timeline Event with ID ${id} not found.`);
    }

    const merged = { ...existing, ...updates };
    const validation = await this.validate(merged);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(' '));
    }

    const updated = await persistenceService.timeline.update(id, {
      ...updates,
      updatedAt: new Date().toISOString()
    });

    if (!updated) {
      throw new Error(`Failed to update Timeline Event with ID ${id}.`);
    }

    this.triggerIntegrationNotification('update', updated);
    return updated;
  }

  /**
   * Permanently deletes a timeline event.
   */
  static async deleteEvent(id: string): Promise<boolean> {
    const existing = await persistenceService.timeline.getById(id);
    if (!existing) return false;

    const deleted = await persistenceService.timeline.delete(id);
    if (deleted) {
      this.triggerIntegrationNotification('delete', existing);
    }
    return deleted;
  }

  /**
   * Duplicates a timeline event.
   */
  static async duplicateEvent(id: string): Promise<TimelineEventSchema> {
    const duplicated = await persistenceService.timeline.duplicate(id);
    if (!duplicated) {
      throw new Error(`Failed to duplicate Timeline Event with ID ${id}.`);
    }

    this.triggerIntegrationNotification('duplicate', duplicated);
    return duplicated;
  }

  /**
   * Archives a timeline event.
   */
  static async archiveEvent(id: string): Promise<TimelineEventSchema> {
    const updated = await persistenceService.timeline.archive(id);
    if (!updated) throw new Error(`Timeline Event with ID ${id} not found.`);
    this.triggerIntegrationNotification('archive', updated);
    return updated;
  }

  /**
   * Restores an archived timeline event.
   */
  static async restoreEvent(id: string): Promise<TimelineEventSchema> {
    const updated = await persistenceService.timeline.restore(id);
    if (!updated) throw new Error(`Timeline Event with ID ${id} not found.`);
    this.triggerIntegrationNotification('restore', updated);
    return updated;
  }

  /**
   * Reorders a timeline event.
   */
  static async reorderEvent(id: string, direction: 'up' | 'down'): Promise<TimelineEventSchema[]> {
    const reordered = await persistenceService.timeline.reorder(id, direction);
    return reordered;
  }

  /**
   * Marks or unmarks a timeline event as a milestone.
   */
  static async markMilestone(id: string, isMilestone: boolean): Promise<TimelineEventSchema> {
    const updated = await this.updateEvent(id, { milestone: isMilestone });
    return updated;
  }

  /**
   * Retrieves timeline statistics.
   */
  static async getStatistics(profileId?: string, storyId?: string): Promise<{
    total: number;
    milestones: number;
    yearsCovered: string;
    recentlyUpdated: TimelineEventSchema[];
    draft: number;
    archived: number;
  }> {
    let items = await persistenceService.timeline.getAll();
    
    if (profileId) {
      items = items.filter(item => item.profileId === profileId);
    }
    if (storyId) {
      items = items.filter(item => item.storyId === storyId);
    }

    const total = items.filter(s => s.status !== 'Archived').length;
    const milestones = items.filter(s => s.status !== 'Archived' && s.milestone).length;
    const draft = items.filter(s => s.status === 'Draft').length;
    const archived = items.filter(s => s.status === 'Archived').length;

    // Years Covered calculation
    const activeItems = items.filter(s => s.status !== 'Archived');
    const years = activeItems
      .map(item => parseInt(item.year))
      .filter(year => !isNaN(year));
    
    let yearsCovered = 'No events';
    if (years.length > 0) {
      const minYear = Math.min(...years);
      const maxYear = Math.max(...years);
      if (minYear === maxYear) {
        yearsCovered = `${minYear} (${years.length} yr)`;
      } else {
        yearsCovered = `${minYear} - ${maxYear} (${maxYear - minYear} yrs)`;
      }
    }

    const recentlyUpdated = [...items]
      .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
      .slice(0, 5);

    return {
      total,
      milestones,
      yearsCovered,
      recentlyUpdated,
      draft,
      archived
    };
  }

  /**
   * Integration hooks
   */
  private static triggerIntegrationNotification(action: string, event: TimelineEventSchema) {
    console.log(`[F5-TimelineIntegration] Timeline Event "${event.title}" subject to action "${action}".`);

    // Log dynamic activity
    if (action === 'create') {
      ActivityService.logActivity(
        'Timeline Event Added',
        `Milestone event "${event.title}" added to chronology.`,
        'bg-cinema-amber-500'
      ).catch(err => console.warn('Failed to log timeline creation activity', err));
    } else if (action === 'update') {
      ActivityService.logActivity(
        'Timeline Event Edited',
        `Chronology event "${event.title}" has been updated.`,
        'bg-indigo-500'
      ).catch(err => console.warn('Failed to log timeline update activity', err));
    }

    // Notifications integration
    if (persistenceService.notifications) {
      persistenceService.notifications.create({
        title: `Timeline Event ${action.toUpperCase()}`,
        message: `Your event "${event.title}" has been successfully ${action}ed.`,
        type: 'success',
        read: false,
        schemaVersion: 1
      }).catch(err => console.warn('Failed to dispatch background notification', err));
    }

    // Real-time recalculation of counts on associated Legacy Profile
    if (event.profileId) {
      persistenceService.timeline.getByProfileId(event.profileId).then(profileEvents => {
        const activeCount = profileEvents.filter(e => e.status !== 'Archived').length;
        persistenceService.profiles.update(event.profileId, {
          timelineEventsCount: activeCount
        }).catch(err => console.warn('Failed to update profile events count', err));
      });
    }

    // Future Media pipeline integration hook
    // Future AI Generation pipeline integration hook
    // Future Video compilation compiler hook
    // Future Export compiles hook
  }
}
