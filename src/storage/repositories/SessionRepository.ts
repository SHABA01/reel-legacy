/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseRepository } from './BaseRepository';
import { SessionSchema } from '../schemas/schemas';

export class SessionRepository extends BaseRepository<SessionSchema> {
  protected storageKey = 'sessions';

  async getActiveSession(): Promise<SessionSchema | null> {
    const items = await this.getAll();
    const now = new Date();
    
    // Find the first non-expired session
    return items.find(item => new Date(item.expiresAt) > now) || null;
  }
}
