/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  schemaVersion: number;
}

export interface LegacyProfileSchema extends BaseEntity {
  firstName: string;
  middleName?: string;
  lastName: string;
  preferredName?: string;
  nickname?: string;
  gender?: string;
  dateOfBirth: string;
  placeOfBirth?: string;
  dateOfDeath?: string;
  placeOfDeath?: string;
  nationality?: string;
  languages?: string[];
  lifeStatus: 'living' | 'memorial' | 'historical';
  category: 'personal' | 'autobiography' | 'memorial' | 'celebration' | 'career' | 'family-history' | 'historical-figure' | 'organization' | 'community';
  relationship: string;
  coverPhoto: string;
  profilePhoto: string;
  status: 'draft' | 'published' | 'archived';
  storyProgress: number;
  mediaCount: number;
  timelineEventsCount: number;
  documentCount: number;
  biographySummary?: string;
  tags?: string[];
  familyMembers?: { relation: string; name: string }[];
}

export interface StorySchema extends BaseEntity {
  title: string;
  subtitle: string;
  description: string;
  category: string; // Map of Story Type / Category
  status: string;
  completionProgress: number;
  durationEstimate: string;
  lastEdited: string;
  lastGenerated: string | null;
  aiReady: boolean;
  mediaCount: number;
  chapterCount: number;
  timelineEventCount: number;
  associatedProfileId: string;
  associatedProfileName: string;
  associatedProfilePhoto: string;
  associatedProfileRelationship: string;
  pinned: boolean;
  favorite: boolean;
  tags: string[];
  contributors: string[];

  // F4 Story System additions
  ownerId?: string;
  summary?: string;
  theme?: string;
  mood?: string;
  narrativeStyle?: string;
  primaryLanguage?: string;
  visibility?: string;
  thumbnail?: string;
  coverImage?: string;
  categories?: string[];
  publishedAt?: string;
  metadata?: Record<string, any>;
  version?: number;

  // Embedded collections for fully featured Story Details
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
}

export interface MediaAssetSchema extends BaseEntity {
  name: string;
  type: 'image' | 'video' | 'audio' | 'document';
  category: string;
  size: string;
  bytes: number;
  resolution?: string;
  duration?: string;
  uploadDate: string;
  tags: string[];
  linkedStoryId: string;
  linkedStoryName: string;
  linkedEvents: string[];
  linkedChapters: string[];
  favorite: boolean;
  status: 'Ready' | 'Optimizing' | 'Needs Metadata' | 'Flagged';
  thumbnailUrl: string;
  description: string;
  archived: boolean;

  // F6 Media System additions
  ownerId?: string;
  profileId?: string;
  legacyProfileId?: string;
  timelineEventId?: string;
  originalFilename?: string;
  displayName?: string;
  mimeType?: string;
  extension?: string;
  lastModified?: string;
  localStorageReference?: string;
  categories?: string[];
  metadata?: Record<string, any>;
  version?: number;
}

export interface CollectionSchema extends BaseEntity {
  name: string;
  description: string;
  coverImage: string;
  assetCount: number;
  lastUpdated: string;
  tags: string[];
}

export interface TimelineEventSchema extends BaseEntity {
  profileId: string;
  storyId?: string;
  year: string;
  date?: string;
  title: string;
  description: string;
  category: string;
  location?: string;
  mediaIds?: string[];

  // F5 Timeline additions
  ownerId?: string;
  subtitle?: string;
  eventType?: string;
  startDate?: string;
  endDate?: string;
  datePrecision?: 'Exact' | 'Month' | 'Year' | 'Unknown';
  peopleInvolved?: string[];
  documentIds?: string[];
  importance?: 'High' | 'Medium' | 'Low';
  milestone?: boolean;
  tags?: string[];
  categories?: string[];
  visibility?: string;
  status?: string;
  sortOrder?: number;
  metadata?: Record<string, any>;
  version?: number;
}

export interface UserSchema extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  displayName?: string;
  passwordHash: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  bio?: string;
  timeZone?: string;
  country?: string;
  language?: string;
  verified: boolean;
  lastLogin?: string;
  accountStatus: 'active' | 'suspended' | 'pending';
  metadata?: Record<string, any>;
  role: string;
}

export interface SessionSchema extends BaseEntity {
  userId: string;
  token: string;
  expiresAt: string;
}

export interface SettingsSchema extends BaseEntity {
  userId?: string;
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
  fontScale: 'small' | 'medium' | 'large' | 'xlarge' | string;
  motionPref: 'smooth' | 'reduced' | string;
  compactMode: boolean;
  animationIntensity: 'low' | 'moderate' | 'high' | string;
  
  // Workspace Behavior
  sidebarBehavior: 'expanded' | 'collapsed' | 'hover' | string;
  rightPanelBehavior: 'collapsible' | 'fixed' | 'hidden' | string;
  defaultView: 'dashboard' | 'profiles' | 'stories' | 'media' | string;
  cardDensity: 'comfortable' | 'compact' | 'standard' | string;
  tableDensity: 'comfortable' | 'compact' | 'standard' | string;

  // Notification Preferences
  notificationsEnabled: boolean;
  inAppNotifs: boolean;
  emailDigest: boolean;
  weeklyReminders: boolean;
  securityLogs: boolean;
  uploadNotifs: boolean;
  storyNotifs: boolean;
  timelineNotifs: boolean;

  // Playback Preferences
  playbackQuality: 'auto' | 'high' | 'medium' | 'low' | string;
  playbackAutoplay: boolean;
  playbackMuteByDefault: boolean;
  playbackTransitionSpeed: 'instant' | 'fast' | 'normal' | 'slow' | string;

  // Upload Preferences
  uploadAutoOptimize: boolean;
  uploadMaxResolution: string;

  // Accessibility Preferences
  highContrast: boolean;
  reducedMotion: boolean;
  largerText: boolean;
  keyboardNavigation: boolean;
  screenReader: boolean;
  focusVisibility: boolean;
  density: 'comfortable' | 'compact' | 'standard' | string;

  // Privacy Preferences
  analyticsEnabled: boolean;
  dataSharing: boolean;
  profileVisibility: 'private' | 'public' | 'invite-only' | string;
  storyVisibility: 'private' | 'public' | 'invite-only' | string;
  legacyProfilePrivacy: string;
  searchVisibility: string;
  consentPreferences: boolean;

  // Security Preferences
  twoFactorEnabled: boolean;
  backupCodesLeft: number;
  lastLogin?: string;

  // Account Preferences (can be persisted either on user profile or in global settings)
  fullName?: string;
  displayName?: string;
  email?: string;
  phone?: string;
  dob?: string;
  country?: string;
  timeZone?: string;
  preferredLanguage?: string;
  avatar?: string;
  coverImage?: string;
  emailVerified?: boolean;

  // Co-Author Profile
  firstName?: string;
  lastName?: string;
  citations?: string;
  biography?: string;

  autoSave: boolean;
  marketingConsent: boolean;
  archivingPreferences: string;
  version: string;
  lastUpdated: string;
}

export interface NotificationSchema extends BaseEntity {
  title: string;
  message: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface DocumentSchema extends BaseEntity {
  ownerId: string;
  profileId: string;
  storyId?: string;
  timelineEventId?: string;
  originalFilename: string;
  displayName: string;
  documentType: string;
  mimeType: string;
  extension: string;
  fileSize: string;
  bytes: number;
  uploadDate: string;
  lastModified: string;
  localStorageReference: string;
  description: string;
  tags: string[];
  categories: string[];
  favorite: boolean;
  archived: boolean;
  metadata?: Record<string, any>;
  version: number;
}

export interface ImportSchema extends BaseEntity {
  ownerId: string;
  profileId: string;
  storyId?: string;
  originalFilename: string;
  displayName: string;
  importType: 'Resume / CV' | 'Biography' | 'Autobiography' | 'Memoir' | 'Obituary' | 'Personal Notes' | 'Interview Transcript' | 'Journal' | 'Letter Collection' | string;
  mimeType: string;
  extension: string;
  fileSize: string;
  bytes: number;
  uploadDate: string;
  lastModified: string;
  localStorageReference: string;
  description: string;
  tags: string[];
  categories: string[];
  importStatus: 'Pending' | 'Processed' | 'Failed' | 'Archived' | string;
  favorite: boolean;
  archived: boolean;
  metadata?: Record<string, any>;
  version: number;
}

