/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IStorageAdapter } from './StorageAdapter';

/**
 * Remote API Configuration Interface
 */
export interface RemoteApiConfig {
  baseUrl?: string;
  getAuthToken?: () => Promise<string | null> | string | null;
  defaultHeaders?: Record<string, string>;
  timeoutMs?: number;
  enableFallbackToLocal?: boolean;
}

/**
 * Typed Remote API Errors
 */
export class RemoteApiError extends Error {
  public status?: number;
  public endpoint?: string;
  public details?: unknown;

  constructor(message: string, status?: number, endpoint?: string, details?: unknown) {
    super(message);
    this.name = 'RemoteApiError';
    this.status = status;
    this.endpoint = endpoint;
    this.details = details;
  }
}

export class RemoteApiUnavailableError extends RemoteApiError {
  constructor(endpoint: string, originalError?: unknown) {
    super(`Remote persistence backend is unreachable or not yet configured at: ${endpoint}`, 503, endpoint, originalError);
    this.name = 'RemoteApiUnavailableError';
  }
}

/**
 * RemoteApiAdapter
 * 
 * Transport-agnostic remote persistence adapter for ReelLegacy.
 * Bridges repositories to a remote HTTP/REST, GraphQL, or Cloud storage service.
 * Supports token injection, structured error reporting, and configurable timeouts.
 */
export class RemoteApiAdapter implements IStorageAdapter {
  private baseUrl: string;
  private getAuthToken?: () => Promise<string | null> | string | null;
  private defaultHeaders: Record<string, string>;
  private timeoutMs: number;

  constructor(config: RemoteApiConfig = {}) {
    this.baseUrl = config.baseUrl || (typeof process !== 'undefined' && process.env?.VITE_API_BASE_URL) || '/api/storage';
    this.getAuthToken = config.getAuthToken;
    this.defaultHeaders = config.defaultHeaders || {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    this.timeoutMs = config.timeoutMs || 10000;
  }

  private async getHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = { ...this.defaultHeaders };
    if (this.getAuthToken) {
      const token = await this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  }

  private getUrl(key: string): string {
    const cleanBase = this.baseUrl.replace(/\/+$/, '');
    return `${cleanBase}/${encodeURIComponent(key)}`;
  }

  private async fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      return response;
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        throw new RemoteApiError(`Request timed out after ${this.timeoutMs}ms for ${url}`, 408, url);
      }
      throw new RemoteApiUnavailableError(url, err);
    } finally {
      clearTimeout(timer);
    }
  }

  async getItem<T>(key: string): Promise<T | null> {
    const url = this.getUrl(key);
    try {
      const headers = await this.getHeaders();
      const response = await this.fetchWithTimeout(url, {
        method: 'GET',
        headers
      });

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new RemoteApiError(
          `Failed to fetch remote item for key '${key}': ${response.statusText}`,
          response.status,
          url
        );
      }

      const data = await response.json();
      return (data?.data ?? data) as T;
    } catch (error) {
      if (error instanceof RemoteApiError) {
        throw error;
      }
      throw new RemoteApiUnavailableError(url, error);
    }
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    const url = this.getUrl(key);
    try {
      const headers = await this.getHeaders();
      const response = await this.fetchWithTimeout(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ data: value })
      });

      if (!response.ok) {
        throw new RemoteApiError(
          `Failed to persist item remotely for key '${key}': ${response.statusText}`,
          response.status,
          url
        );
      }
    } catch (error) {
      if (error instanceof RemoteApiError) {
        throw error;
      }
      throw new RemoteApiUnavailableError(url, error);
    }
  }

  async removeItem(key: string): Promise<void> {
    const url = this.getUrl(key);
    try {
      const headers = await this.getHeaders();
      const response = await this.fetchWithTimeout(url, {
        method: 'DELETE',
        headers
      });

      if (!response.ok && response.status !== 404) {
        throw new RemoteApiError(
          `Failed to delete remote item for key '${key}': ${response.statusText}`,
          response.status,
          url
        );
      }
    } catch (error) {
      if (error instanceof RemoteApiError) {
        throw error;
      }
      throw new RemoteApiUnavailableError(url, error);
    }
  }

  async clear(): Promise<void> {
    const url = this.baseUrl;
    try {
      const headers = await this.getHeaders();
      const response = await this.fetchWithTimeout(url, {
        method: 'DELETE',
        headers
      });

      if (!response.ok) {
        throw new RemoteApiError(
          `Failed to clear remote storage: ${response.statusText}`,
          response.status,
          url
        );
      }
    } catch (error) {
      if (error instanceof RemoteApiError) {
        throw error;
      }
      throw new RemoteApiUnavailableError(url, error);
    }
  }

  async exists(key: string): Promise<boolean> {
    const url = this.getUrl(key);
    try {
      const headers = await this.getHeaders();
      const response = await this.fetchWithTimeout(url, {
        method: 'HEAD',
        headers
      });

      return response.ok;
    } catch {
      return false;
    }
  }
}
