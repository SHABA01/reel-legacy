/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Storage Adapter Interface (IStorageAdapter)
 * 
 * Defines the contract for all persistence adapters in ReelLegacy.
 * Abstracted from underlying storage technologies (localStorage, IndexedDB,
 * REST APIs, GraphQL, Firebase Firestore, or Cloud SQL endpoints).
 */
export interface IStorageAdapter {
  getItem<T>(key: string): Promise<T | null>;
  setItem<T>(key: string, value: T): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
  exists(key: string): Promise<boolean>;

  // Optional batch / query support
  query?<T>(collectionKey: string, predicate: (item: T) => boolean): Promise<T[]>;
  batchSet?<T>(items: Array<{ key: string; value: T }>): Promise<void>;
  batchRemove?(keys: string[]): Promise<void>;
}

/**
 * Backwards-compatible type alias
 */
export type StorageAdapter = IStorageAdapter;
