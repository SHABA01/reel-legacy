/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TemplateCategory =
  | 'All Templates'
  | 'Featured'
  | 'Personal Biography'
  | 'Family Legacy'
  | 'Memorial'
  | 'Celebration of Life'
  | 'Wedding Story'
  | 'Love Story'
  | 'Military Service'
  | 'Business Legacy'
  | 'Historical Figure'
  | 'Faith Journey'
  | 'Travel Memories'
  | 'Custom Templates'
  | 'Community Templates'
  | 'Saved Templates';

export type TemplateDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface TemplateSceneBlueprint {
  id: string;
  title: string;
  narrativePurpose: string;
  suggestedDuration: string;
  recommendedCameraMovement: string;
  suggestedAssets: string[];
  narrationObjective: string;
  musicRecommendation: string;
  transitionType: string;
}

export interface TemplateChapter {
  id: string;
  title: string;
  objective: string;
  suggestedScenes: TemplateSceneBlueprint[];
}

export interface TemplateAct {
  id: string;
  actNumber: number;
  title: string;
  description: string;
  durationMinutes: number;
  chapters: TemplateChapter[];
}

export interface InterviewQuestionGroup {
  category: string;
  questions: string[];
}

export interface AIPromptPack {
  title: string;
  purpose: string;
  prompt: string;
}

export interface MusicSuggestion {
  title: string;
  genre: string;
  mood: string;
  tempo: string;
  instrumentation: string;
  transitionStyle: string;
}

export interface NarrativeBlueprint {
  narrationStyle: string;
  musicStyle: string;
  cameraStyle: string;
  visualStyle: string;
  recommendedSceneFlow: string;
  acts: TemplateAct[];
  interviewQuestions: InterviewQuestionGroup[];
  aiPromptPacks: AIPromptPack[];
  musicSuggestions: MusicSuggestion[];
  requiredAssets: string[];
  aiNotes: string;
}

export interface TemplateVersion {
  version: string;
  date: string;
  changes: string;
}

export interface StoryTemplate {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  category: TemplateCategory;
  difficulty: TemplateDifficulty;
  estimatedRuntime: string;
  sceneCount: number;
  chapterCount: number;
  actCount: number;
  storyType: string;
  recommendedAudience: string;
  popularity: number; // 0 - 100
  aiCompatibility: 'Full' | 'Partial' | 'Standard';
  recentlyUpdated: string;
  isFeatured?: boolean;
  isPopular?: boolean;
  isCustom?: boolean;
  isCommunity?: boolean;
  isFavorite?: boolean;
  author?: string;
  version: string;
  versionHistory: TemplateVersion[];
  rating?: number;
  tags: string[];
  narrativeBlueprint: NarrativeBlueprint;
}

export interface TemplateFilterState {
  searchQuery: string;
  category: TemplateCategory;
  difficulty: string;
  duration: string;
  style: string;
  audience: string;
  tab: 'all' | 'featured' | 'popular' | 'recently_used' | 'ai_recommended' | 'custom' | 'community';
  viewMode: 'grid' | 'list';
}

export interface AppliedStoryBlueprint {
  templateId: string;
  templateName: string;
  storyTitle: string;
  profileName?: string;
  createdAt: string;
  actCount: number;
  chapterCount: number;
  sceneCount: number;
  status: 'scaffolded' | 'in_progress' | 'ready_for_render';
}
