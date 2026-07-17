/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ExtendedStory {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category:
    | 'Biography'
    | 'Autobiography'
    | 'Memorial'
    | 'Celebration of Life'
    | 'Career Documentary'
    | 'Family Documentary'
    | 'Historical Documentary'
    | 'Tribute'
    | 'Anniversary'
    | 'Graduation'
    | 'Retirement'
    | 'Wedding'
    | 'Birthday';
  status:
    | 'Draft'
    | 'In Progress'
    | 'Ready for AI'
    | 'AI Processing'
    | 'Review'
    | 'Published'
    | 'Archived';
  completionProgress: number; // 0 - 100
  durationEstimate: string; // e.g. "12 mins"
  lastEdited: string; // ISO string
  lastGenerated: string | null; // ISO string or null
  aiReady: boolean;
  mediaCount: number;
  chapterCount: number;
  timelineEventCount: number;
  
  // Associated Legacy Profile details
  associatedProfileId: string;
  associatedProfileName: string;
  associatedProfilePhoto: string;
  associatedProfileRelationship: string;

  // Metadata & Organizers
  pinned: boolean;
  favorite: boolean;
  tags: string[];
  contributors: string[];

  // Lists for Details Page preview
  chapters?: {
    id: string;
    title: string;
    duration: string;
    summary: string;
    mediaCount: number;
  }[];
  timelineEvents?: {
    id: string;
    year: string;
    title: string;
    description: string;
  }[];
  mediaPreviews?: {
    id: string;
    type: 'image' | 'video' | 'audio' | 'document';
    url: string;
    title: string;
  }[];
  recentActivity?: {
    id: string;
    user: string;
    action: string;
    date: string;
  }[];
  aiInsights?: string[];
  coverImage: string;
}

export const STORY_TYPES = [
  'Biography',
  'Autobiography',
  'Memorial',
  'Celebration of Life',
  'Career Documentary',
  'Family Documentary',
  'Historical Documentary',
  'Tribute',
  'Anniversary',
  'Graduation',
  'Retirement',
  'Wedding',
  'Birthday'
] as const;

export const STORY_STATUSES = [
  'Draft',
  'In Progress',
  'Ready for AI',
  'AI Processing',
  'Review',
  'Published',
  'Archived'
] as const;

export const STORY_TYPE_ICONS: Record<string, string> = {
  'Biography': 'BookOpen',
  'Autobiography': 'User',
  'Memorial': 'Heart',
  'Celebration of Life': 'Sparkles',
  'Career Documentary': 'Briefcase',
  'Family Documentary': 'Users',
  'Historical Documentary': 'Globe',
  'Tribute': 'Award',
  'Anniversary': 'Calendar',
  'Graduation': 'GraduationCap',
  'Retirement': 'Wine',
  'Wedding': 'HeartHandshake',
  'Birthday': 'Gift'
};

export const INITIAL_STORIES: ExtendedStory[] = [];
