/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StorageAdapter } from '../adapters/StorageAdapter';

export abstract class BaseRepository<T extends { id: string; createdAt?: string; updatedAt?: string }> {
  protected adapter: StorageAdapter;
  protected abstract storageKey: string;

  constructor(adapter: StorageAdapter) {
    this.adapter = adapter;
  }

  async getAll(): Promise<T[]> {
    const data = await this.adapter.getItem<T[]>(this.storageKey);
    return data || [];
  }

  async getById(id: string): Promise<T | null> {
    const items = await this.getAll();
    return items.find(item => item.id === id) || null;
  }

  private notifyChange(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('reellegacy-data-changed'));
    }
  }

  async create(item: Omit<T, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<T> {
    const items = await this.getAll();
    const newItem = {
      ...item,
      id: item.id || `id-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as unknown as T;

    items.push(newItem);
    await this.adapter.setItem(this.storageKey, items);
    this.notifyChange();
    return newItem;
  }

  async update(id: string, updates: Partial<T>): Promise<T | null> {
    const items = await this.getAll();
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;

    const updatedItem = {
      ...items[index],
      ...updates,
      updatedAt: new Date().toISOString()
    } as T;

    items[index] = updatedItem;
    await this.adapter.setItem(this.storageKey, items);
    this.notifyChange();
    return updatedItem;
  }

  async delete(id: string): Promise<boolean> {
    const items = await this.getAll();
    const initialLength = items.length;
    const filtered = items.filter(item => item.id !== id);
    
    if (filtered.length === initialLength) return false;
    
    await this.adapter.setItem(this.storageKey, filtered);
    this.notifyChange();
    return true;
  }

  async exists(id: string): Promise<boolean> {
    const items = await this.getAll();
    return items.some(item => item.id === id);
  }

  async saveAll(items: T[]): Promise<void> {
    await this.adapter.setItem(this.storageKey, items);
    this.notifyChange();
  }

  async count(): Promise<number> {
    const items = await this.getAll();
    return items.length;
  }
}
