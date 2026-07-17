/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseRepository } from './BaseRepository';
import { NotificationSchema } from '../schemas/schemas';

export class NotificationRepository extends BaseRepository<NotificationSchema> {
  protected storageKey = 'notifications';

  async getUnread(): Promise<NotificationSchema[]> {
    const items = await this.getAll();
    return items.filter(item => !item.read);
  }

  async markAsRead(id: string): Promise<NotificationSchema | null> {
    return this.update(id, { read: true });
  }

  async markAllAsRead(): Promise<void> {
    const items = await this.getAll();
    const updated = items.map(item => ({ ...item, read: true, updatedAt: new Date().toISOString() }));
    await this.adapter.setItem(this.storageKey, updated);
  }
}
