/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IStorageAdapter } from './StorageAdapter';

/**
 * LocalStorageAdapter
 * 
 * Production-safe, resilient browser local storage adapter.
 * Used for development, offline/demo mode, and local persistent caching.
 */
export class LocalStorageAdapter implements IStorageAdapter {
  private prefix: string;

  constructor(prefix: string = 'rl_') {
    this.prefix = prefix;
  }

  private getFullKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  async getItem<T>(key: string): Promise<T | null> {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return null;
      }
      const value = localStorage.getItem(this.getFullKey(key));
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`LocalStorageAdapter: failed to get item for key '${key}'`, error);
      return null;
    }
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }
      const serialized = JSON.stringify(value);
      localStorage.setItem(this.getFullKey(key), serialized);
    } catch (error) {
      console.error(`LocalStorageAdapter: failed to set item for key '${key}'`, error);
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded');
      }
      throw error;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }
      localStorage.removeItem(this.getFullKey(key));
    } catch (error) {
      console.error(`LocalStorageAdapter: failed to remove item for key '${key}'`, error);
    }
  }

  async clear(): Promise<void> {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }
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
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      return localStorage.getItem(this.getFullKey(key)) !== null;
    } catch {
      return false;
    }
  }

  async query<T>(collectionKey: string, predicate: (item: T) => boolean): Promise<T[]> {
    const items = await this.getItem<T[]>(collectionKey);
    if (!Array.isArray(items)) return [];
    return items.filter(predicate);
  }

  async batchSet<T>(items: Array<{ key: string; value: T }>): Promise<void> {
    for (const item of items) {
      await this.setItem(item.key, item.value);
    }
  }

  async batchRemove(keys: string[]): Promise<void> {
    for (const key of keys) {
      await this.removeItem(key);
    }
  }
}
