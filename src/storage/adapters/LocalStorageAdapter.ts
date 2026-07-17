/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StorageAdapter } from './StorageAdapter';

export class LocalStorageAdapter implements StorageAdapter {
  private prefix: string = 'rl_';

  private getFullKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  async getItem<T>(key: string): Promise<T | null> {
    try {
      const value = localStorage.getItem(this.getFullKey(key));
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`LocalStorageAdapter: failed to get item for key ${key}`, error);
      return null;
    }
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(this.getFullKey(key), serialized);
    } catch (error) {
      console.error(`LocalStorageAdapter: failed to set item for key ${key}`, error);
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded');
      }
      throw error;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      localStorage.removeItem(this.getFullKey(key));
    } catch (error) {
      console.error(`LocalStorageAdapter: failed to remove item for key ${key}`, error);
    }
  }

  async clear(): Promise<void> {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error(`LocalStorageAdapter: failed to clear storage`, error);
    }
  }

  async exists(key: string): Promise<boolean> {
    return localStorage.getItem(this.getFullKey(key)) !== null;
  }
}
