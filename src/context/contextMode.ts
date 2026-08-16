/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum ContextMode {
  Required = 'Required',
  Optional = 'Optional',
  None = 'None',
}

export const ROUTE_CONTEXT_MODES: Record<string, ContextMode> = {
  // Required Context Workspaces (Category A)
  'story-studio-workspace': ContextMode.Required,
  'media-library': ContextMode.Required,
  'narration-studio': ContextMode.Required,
  'story-templates': ContextMode.Required,

  // Optional Context Pages (Category B)
  'dashboard': ContextMode.Optional,
  'legacy-profiles': ContextMode.Optional,
  'story-library': ContextMode.Optional,
  'render-queue': ContextMode.Optional,

  // Context-Free Pages (Category C)
  'story-studio-landing': ContextMode.None,
  'studio-analytics': ContextMode.None,
  'integrations': ContextMode.None,
  'search': ContextMode.None,
  'notifications': ContextMode.None,
  'help': ContextMode.None,
  'settings': ContextMode.None,
};
