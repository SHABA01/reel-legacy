/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ThemeMode = 'light' | 'dark' | 'system';

export type ActiveView =
  | 'dashboard'
  | 'stories'
  | 'studio'
  | 'timeline'
  | 'profiles'
  | 'media'
  | 'narration'
  | 'templates'
  | 'render'
  | 'analytics'
  | 'integrations'
  | 'settings'
  | 'notifications'
  | 'search'
  | 'help';

export type OverlayType = 'search' | 'ai' | 'notifications' | null;

export type ToastType = 'success' | 'warning' | 'error' | 'info' | 'loading';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
  duration?: number; // ms
}

export type RightPanelWidget =
  | 'ai-suggestions'
  | 'metadata'
  | 'properties'
  | 'comments'
  | 'versions';

export interface NavigationItem {
  id: ActiveView;
  label: string;
  category: 'home' | 'storytelling' | 'assets' | 'production' | 'system';
  icon: string; // Used to look up the Lucide icon
}
