/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseRepository } from './BaseRepository';
import { UserSchema } from '../schemas/schemas';

export class UserRepository extends BaseRepository<UserSchema> {
  protected storageKey = 'users';

  async getByEmail(email: string): Promise<UserSchema | null> {
    const items = await this.getAll();
    return items.find(item => item.email.toLowerCase() === email.toLowerCase()) || null;
  }
}
