/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type IntegrationCategory =
  | 'All'
  | 'Cloud Storage'
  | 'AI Providers'
  | 'Genealogy'
  | 'Media Libraries'
  | 'Video Platforms'
  | 'Communication'
  | 'Automation'
  | 'Developer APIs';

export type IntegrationStatus = 'connected' | 'disconnected' | 'syncing' | 'error' | 'beta';

export interface IntegrationProvider {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: IntegrationCategory;
  logoUrl?: string;
  iconName: string;
  iconColor: string;
  status: IntegrationStatus;
  isRecommended?: boolean;
  connectedAccount?: string;
  lastSyncTime?: string;
  syncFrequency?: 'Real-time' | 'Hourly' | 'Daily' | 'Manual';
  storageUsedMb?: number;
  setupDifficulty: 'Easy' | 'Moderate' | 'Advanced';
  setupTimeMinutes: number;
  rating: number;
  benefits: string[];
  features: string[];
  permissionsCanAccess: string[];
  permissionsCannotAccess: string[];
  oauthScopes?: string[];
  version: string;
  documentationUrl?: string;
}

export interface AutomationRule {
  id: string;
  title: string;
  description: string;
  triggerEvent: string;
  actionService: string;
  actionServiceId: string;
  enabled: boolean;
  lastRun?: string;
  runCount: number;
  category: 'Backup' | 'Narration' | 'Genealogy' | 'Export' | 'Notification';
}

export interface SyncLogEvent {
  id: string;
  integrationId: string;
  integrationName: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'info';
  message: string;
  details?: string;
  transferredBytes?: number;
}
