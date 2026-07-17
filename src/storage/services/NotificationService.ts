/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { persistenceService } from './PersistenceService';

export class NotificationService {
  static async createNotification(
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info'
  ): Promise<void> {
    await persistenceService.notifications.create({
      title,
      message,
      read: false,
      type,
      schemaVersion: 1
    });
  }

  static async getUnreadCount(): Promise<number> {
    const unread = await persistenceService.notifications.getUnread();
    return unread.length;
  }
}
