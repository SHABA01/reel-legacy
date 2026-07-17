/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LocalStorageAdapter } from '../adapters/LocalStorageAdapter';
import { NotificationService } from './NotificationService';

export interface ActivityItem {
  id: string;
  title: string;
  desc: string;
  timestamp: string;
  iconColor: string;
}

export class ActivityService {
  private static STORAGE_KEY = 'reellegacy_activities';
  private static adapter = new LocalStorageAdapter();

  /**
   * Logs a new activity.
   */
  static async logActivity(title: string, desc: string, iconColor = 'bg-cinema-amber-500'): Promise<ActivityItem> {
    const activities = await this.getActivitiesRaw();
    
    const newActivity: ActivityItem = {
      id: `act-${Math.random().toString(36).substring(2, 9)}`,
      title,
      desc,
      timestamp: new Date().toISOString(),
      iconColor,
    };

    activities.unshift(newActivity);
    
    // Keep a maximum of 50 activities for performance
    const trimmed = activities.slice(0, 50);
    await this.adapter.setItem(this.STORAGE_KEY, trimmed);

    // Also automatically create an in-app notification for critical milestones
    await NotificationService.createNotification(title, desc, 'success');

    // Trigger storage event so listening views can auto-update
    window.dispatchEvent(new Event('storage-activity-updated'));

    return newActivity;
  }

  /**
   * Retrieves raw activities.
   */
  private static async getActivitiesRaw(): Promise<ActivityItem[]> {
    const data = await this.adapter.getItem<ActivityItem[]>(this.STORAGE_KEY);
    return data || this.getInitialActivities();
  }

  /**
   * Get formatted activities with dynamic relative time strings.
   */
  static async getActivities(): Promise<Array<ActivityItem & { time: string }>> {
    const raw = await this.getActivitiesRaw();
    return raw.map(act => ({
      ...act,
      time: this.getRelativeTime(act.timestamp),
    }));
  }

  /**
   * Clears all activities.
   */
  static async clearActivities(): Promise<void> {
    await this.adapter.setItem(this.STORAGE_KEY, []);
    window.dispatchEvent(new Event('storage-activity-updated'));
  }

  /**
   * Helper to format relative time.
   */
  private static getRelativeTime(timestamp: string): string {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime();
    
    if (diffMs < 0) return 'Just now';
    
    const diffSecs = Math.floor(diffMs / 1000);
    if (diffSecs < 60) return 'Just now';
    
    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return past.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  }

  /**
   * Initial default activities so the dashboard is not empty on fresh load.
   */
  private static getInitialActivities(): ActivityItem[] {
    const now = new Date();
    
    // Offset timestamps slightly for a realistic sequence
    const t1 = new Date(now.getTime() - 1000 * 60 * 12).toISOString(); // 12 mins ago
    const t2 = new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(); // 2 hours ago
    const t3 = new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(); // Yesterday

    return [
      {
        id: 'init-act-1',
        title: 'Elizabeth Vance voice clip compiled',
        desc: 'Synthesized voiceover narrative track for Scene 2 is locked.',
        timestamp: t1,
        iconColor: 'bg-indigo-500',
      },
      {
        id: 'init-act-2',
        title: 'Uploaded 14 military photographs',
        desc: 'Vance Grandpa military catalog verified and imported.',
        timestamp: t2,
        iconColor: 'bg-cinema-amber-500',
      },
      {
        id: 'init-act-3',
        title: 'Created new chapter outline draft',
        desc: 'Phase 2: World War II Childhood established.',
        timestamp: t3,
        iconColor: 'bg-emerald-500',
      },
    ];
  }
}
