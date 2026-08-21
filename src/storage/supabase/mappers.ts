/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { Database } from './database.types';
import type {
  LegacyProfileSchema,
  StorySchema,
  StoryChapterSchema,
  StorySceneSchema,
  MediaAssetSchema,
} from '../schemas/schemas';

type ProfileRow = Database['public']['Tables']['legacy_profiles']['Row'];
type ProfileInsert = Database['public']['Tables']['legacy_profiles']['Insert'];
type ProfileUpdate = Database['public']['Tables']['legacy_profiles']['Update'];

type StoryRow = Database['public']['Tables']['stories']['Row'];
type StoryInsert = Database['public']['Tables']['stories']['Insert'];
type StoryUpdate = Database['public']['Tables']['stories']['Update'];

type ChapterRow = Database['public']['Tables']['story_chapters']['Row'];
type ChapterInsert = Database['public']['Tables']['story_chapters']['Insert'];
type ChapterUpdate = Database['public']['Tables']['story_chapters']['Update'];

type SceneRow = Database['public']['Tables']['story_scenes']['Row'];
type SceneInsert = Database['public']['Tables']['story_scenes']['Insert'];
type SceneUpdate = Database['public']['Tables']['story_scenes']['Update'];

type MediaRow = Database['public']['Tables']['media_assets']['Row'];
type MediaInsert = Database['public']['Tables']['media_assets']['Insert'];
type MediaUpdate = Database['public']['Tables']['media_assets']['Update'];

// ==========================================
// 1. LEGACY PROFILE MAPPERS
// ==========================================

export function mapProfileRowToSchema(row: ProfileRow): LegacyProfileSchema {
  return {
    id: row.id,
    firstName: row.first_name,
    middleName: row.middle_name || undefined,
    lastName: row.last_name,
    preferredName: row.preferred_name || undefined,
    nickname: row.nickname || undefined,
    gender: row.gender || undefined,
    dateOfBirth: row.date_of_birth,
    placeOfBirth: row.place_of_birth || undefined,
    dateOfDeath: row.date_of_death || undefined,
    placeOfDeath: row.place_of_death || undefined,
    nationality: row.nationality || undefined,
    languages: row.languages || [],
    lifeStatus: row.life_status,
    category: row.category,
    relationship: row.relationship,
    coverPhoto: row.cover_photo || '',
    profilePhoto: row.profile_photo || '',
    status: row.status,
    storyProgress: row.story_progress,
    mediaCount: row.media_count,
    timelineEventsCount: row.timeline_events_count,
    documentCount: row.document_count,
    biographySummary: row.biography_summary || undefined,
    tags: row.tags || [],
    familyMembers: Array.isArray(row.family_members)
      ? (row.family_members as { relation: string; name: string }[])
      : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    schemaVersion: 1,
  };
}

export function mapProfileSchemaToInsert(
  schema: Omit<LegacyProfileSchema, 'id' | 'createdAt' | 'updatedAt' | 'schemaVersion'> & { id?: string; userId?: string }
): ProfileInsert {
  return {
    id: schema.id,
    user_id: schema.userId,
    first_name: schema.firstName,
    middle_name: schema.middleName || null,
    last_name: schema.lastName,
    preferred_name: schema.preferredName || null,
    nickname: schema.nickname || null,
    gender: schema.gender || null,
    date_of_birth: schema.dateOfBirth,
    place_of_birth: schema.placeOfBirth || null,
    date_of_death: schema.dateOfDeath || null,
    place_of_death: schema.placeOfDeath || null,
    nationality: schema.nationality || null,
    languages: schema.languages || [],
    life_status: schema.lifeStatus,
    category: schema.category,
    relationship: schema.relationship || 'Self',
    cover_photo: schema.coverPhoto || null,
    profile_photo: schema.profilePhoto || null,
    status: schema.status || 'draft',
    story_progress: schema.storyProgress ?? 0,
    media_count: schema.mediaCount ?? 0,
    timeline_events_count: schema.timelineEventsCount ?? 0,
    document_count: schema.documentCount ?? 0,
    biography_summary: schema.biographySummary || null,
    tags: schema.tags || [],
    family_members: schema.familyMembers ? (schema.familyMembers as any) : [],
    preferences: {},
  };
}

export function mapProfileSchemaToUpdate(updates: Partial<LegacyProfileSchema>): ProfileUpdate {
  const updatePayload: ProfileUpdate = {};

  if (updates.firstName !== undefined) updatePayload.first_name = updates.firstName;
  if (updates.middleName !== undefined) updatePayload.middle_name = updates.middleName || null;
  if (updates.lastName !== undefined) updatePayload.last_name = updates.lastName;
  if (updates.preferredName !== undefined) updatePayload.preferred_name = updates.preferredName || null;
  if (updates.nickname !== undefined) updatePayload.nickname = updates.nickname || null;
  if (updates.gender !== undefined) updatePayload.gender = updates.gender || null;
  if (updates.dateOfBirth !== undefined) updatePayload.date_of_birth = updates.dateOfBirth;
  if (updates.placeOfBirth !== undefined) updatePayload.place_of_birth = updates.placeOfBirth || null;
  if (updates.dateOfDeath !== undefined) updatePayload.date_of_death = updates.dateOfDeath || null;
  if (updates.placeOfDeath !== undefined) updatePayload.place_of_death = updates.placeOfDeath || null;
  if (updates.nationality !== undefined) updatePayload.nationality = updates.nationality || null;
  if (updates.languages !== undefined) updatePayload.languages = updates.languages;
  if (updates.lifeStatus !== undefined) updatePayload.life_status = updates.lifeStatus;
  if (updates.category !== undefined) updatePayload.category = updates.category;
  if (updates.relationship !== undefined) updatePayload.relationship = updates.relationship;
  if (updates.coverPhoto !== undefined) updatePayload.cover_photo = updates.coverPhoto || null;
  if (updates.profilePhoto !== undefined) updatePayload.profile_photo = updates.profilePhoto || null;
  if (updates.status !== undefined) updatePayload.status = updates.status;
  if (updates.storyProgress !== undefined) updatePayload.story_progress = updates.storyProgress;
  if (updates.mediaCount !== undefined) updatePayload.media_count = updates.mediaCount;
  if (updates.timelineEventsCount !== undefined) updatePayload.timeline_events_count = updates.timelineEventsCount;
  if (updates.documentCount !== undefined) updatePayload.document_count = updates.documentCount;
  if (updates.biographySummary !== undefined) updatePayload.biography_summary = updates.biographySummary || null;
  if (updates.tags !== undefined) updatePayload.tags = updates.tags;
  if (updates.familyMembers !== undefined) updatePayload.family_members = updates.familyMembers as any;

  return updatePayload;
}

// ==========================================
// 2. STORY MAPPERS
// ==========================================

export function mapStoryRowToSchema(row: StoryRow): StorySchema {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle || '',
    description: row.description || '',
    category: row.category,
    status: row.status,
    completionProgress: row.completion_progress,
    durationEstimate: row.duration_estimate || `${Math.round((row.estimated_duration_seconds || 0) / 60)} mins`,
    lastEdited: row.last_edited,
    lastGenerated: row.last_generated,
    aiReady: row.ai_ready,
    mediaCount: 0,
    chapterCount: 0,
    timelineEventCount: 0,
    associatedProfileId: row.profile_id,
    associatedProfileName: '',
    associatedProfilePhoto: '',
    associatedProfileRelationship: '',
    pinned: row.pinned,
    favorite: row.favorite,
    tags: row.tags || [],
    contributors: Array.isArray(row.contributors) ? (row.contributors as string[]) : [],
    ownerId: row.user_id,
    theme: row.theme || undefined,
    mood: row.mood || undefined,
    narrativeStyle: row.narrative_style || undefined,
    primaryLanguage: row.primary_language || undefined,
    thumbnail: row.thumbnail || undefined,
    coverImage: row.cover_image || undefined,
    categories: row.categories || [],
    publishedAt: row.published_at || undefined,
    metadata: (row.metadata as Record<string, any>) || {},
    version: row.version,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    schemaVersion: 1,
  };
}

export function mapStorySchemaToInsert(
  schema: Omit<StorySchema, 'id' | 'createdAt' | 'updatedAt' | 'schemaVersion' | 'completionProgress'> & {
    id?: string;
    userId?: string;
    completionProgress?: number;
  }
): StoryInsert {
  const durationSec = schema.durationEstimate
    ? parseInt(schema.durationEstimate, 10) * 60 || 0
    : 0;

  return {
    id: schema.id,
    profile_id: schema.associatedProfileId,
    user_id: schema.ownerId || schema.userId,
    title: schema.title,
    subtitle: schema.subtitle || null,
    description: schema.description || null,
    category: schema.category || 'Family Legacy',
    status: (schema.status as any) || 'draft',
    completion_progress: schema.completionProgress ?? 0,
    estimated_duration_seconds: durationSec,
    duration_estimate: schema.durationEstimate || null,
    cover_image: schema.coverImage || null,
    thumbnail: schema.thumbnail || null,
    pinned: schema.pinned ?? false,
    favorite: schema.favorite ?? false,
    ai_ready: schema.aiReady ?? false,
    tags: schema.tags || [],
    categories: schema.categories || [],
    contributors: schema.contributors ? (schema.contributors as any) : [],
    theme: schema.theme || null,
    mood: schema.mood || null,
    narrative_style: schema.narrativeStyle || null,
    primary_language: schema.primaryLanguage || 'en-US',
    metadata: schema.metadata ? (schema.metadata as any) : {},
    version: schema.version ?? 1,
    published_at: schema.publishedAt || null,
    last_edited: schema.lastEdited || new Date().toISOString(),
    last_generated: schema.lastGenerated || null,
  };
}

export function mapStorySchemaToUpdate(updates: Partial<StorySchema>): StoryUpdate {
  const updatePayload: StoryUpdate = {};

  if (updates.title !== undefined) updatePayload.title = updates.title;
  if (updates.subtitle !== undefined) updatePayload.subtitle = updates.subtitle || null;
  if (updates.description !== undefined) updatePayload.description = updates.description || null;
  if (updates.associatedProfileId !== undefined) updatePayload.profile_id = updates.associatedProfileId;
  if (updates.category !== undefined) updatePayload.category = updates.category;
  if (updates.status !== undefined) updatePayload.status = updates.status as any;
  if (updates.completionProgress !== undefined) updatePayload.completion_progress = updates.completionProgress;
  if (updates.durationEstimate !== undefined) {
    updatePayload.duration_estimate = updates.durationEstimate || null;
    updatePayload.estimated_duration_seconds = parseInt(updates.durationEstimate, 10) * 60 || 0;
  }
  if (updates.coverImage !== undefined) updatePayload.cover_image = updates.coverImage || null;
  if (updates.thumbnail !== undefined) updatePayload.thumbnail = updates.thumbnail || null;
  if (updates.pinned !== undefined) updatePayload.pinned = updates.pinned;
  if (updates.favorite !== undefined) updatePayload.favorite = updates.favorite;
  if (updates.aiReady !== undefined) updatePayload.ai_ready = updates.aiReady;
  if (updates.tags !== undefined) updatePayload.tags = updates.tags;
  if (updates.categories !== undefined) updatePayload.categories = updates.categories;
  if (updates.contributors !== undefined) updatePayload.contributors = updates.contributors as any;
  if (updates.theme !== undefined) updatePayload.theme = updates.theme || null;
  if (updates.mood !== undefined) updatePayload.mood = updates.mood || null;
  if (updates.narrativeStyle !== undefined) updatePayload.narrative_style = updates.narrativeStyle || null;
  if (updates.primaryLanguage !== undefined) updatePayload.primary_language = updates.primaryLanguage || null;
  if (updates.metadata !== undefined) updatePayload.metadata = updates.metadata as any;
  if (updates.version !== undefined) updatePayload.version = updates.version;
  if (updates.publishedAt !== undefined) updatePayload.published_at = updates.publishedAt || null;
  if (updates.lastEdited !== undefined) updatePayload.last_edited = updates.lastEdited;
  if (updates.lastGenerated !== undefined) updatePayload.last_generated = updates.lastGenerated || null;

  return updatePayload;
}

// ==========================================
// 3. STORY CHAPTER MAPPERS
// ==========================================

export function mapChapterRowToSchema(row: ChapterRow): StoryChapterSchema {
  return {
    id: row.id,
    storyId: row.story_id,
    title: row.title,
    summary: row.summary || undefined,
    orderIndex: row.order_index,
    timePeriod: row.time_period || undefined,
    estimatedDurationSeconds: row.estimated_duration_seconds,
    duration: row.duration || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    schemaVersion: 1,
  };
}

export function mapChapterSchemaToInsert(
  schema: Omit<StoryChapterSchema, 'id' | 'createdAt' | 'updatedAt' | 'schemaVersion'> & { id?: string }
): ChapterInsert {
  return {
    id: schema.id,
    story_id: schema.storyId,
    title: schema.title,
    summary: schema.summary || null,
    order_index: schema.orderIndex ?? 0,
    time_period: schema.timePeriod || null,
    estimated_duration_seconds: schema.estimatedDurationSeconds ?? 0,
    duration: schema.duration || null,
  };
}

export function mapChapterSchemaToUpdate(updates: Partial<StoryChapterSchema>): ChapterUpdate {
  const updatePayload: ChapterUpdate = {};

  if (updates.title !== undefined) updatePayload.title = updates.title;
  if (updates.summary !== undefined) updatePayload.summary = updates.summary || null;
  if (updates.orderIndex !== undefined) updatePayload.order_index = updates.orderIndex;
  if (updates.timePeriod !== undefined) updatePayload.time_period = updates.timePeriod || null;
  if (updates.estimatedDurationSeconds !== undefined) updatePayload.estimated_duration_seconds = updates.estimatedDurationSeconds;
  if (updates.duration !== undefined) updatePayload.duration = updates.duration || null;

  return updatePayload;
}

// ==========================================
// 4. STORY SCENE MAPPERS
// ==========================================

export function mapSceneRowToSchema(row: SceneRow): StorySceneSchema {
  return {
    id: row.id,
    chapterId: row.chapter_id,
    storyId: row.story_id,
    sceneNumber: row.scene_number,
    title: row.title,
    subtitle: row.subtitle || undefined,
    description: row.description || '',
    purpose: row.purpose || undefined,
    storySegment: row.story_segment,
    sceneType: row.scene_type,
    estimatedDuration: row.estimated_duration || `${Math.floor(row.duration_seconds / 60)}m ${row.duration_seconds % 60}s`,
    durationSeconds: row.duration_seconds,
    notes: row.notes || undefined,
    status: row.status,
    layout: row.layout,
    narrationText: row.narration_text || undefined,
    narrationStatus: row.narration_status,
    assignedVoice: row.assigned_voice || undefined,
    estimatedReadingTime: row.estimated_reading_time || undefined,
    musicTrack: row.music_track || undefined,
    musicMood: row.music_mood || undefined,
    musicVolume: row.music_volume,
    fadeIn: row.fade_in,
    fadeOut: row.fade_out,
    cameraMovement: row.camera_movement || undefined,
    zoomStyle: row.zoom_style || undefined,
    panDirection: row.pan_direction || undefined,
    focusPoint: row.focus_point || undefined,
    transitionType: row.transition_type || undefined,
    primaryCharacterId: row.primary_character_id || undefined,
    quotes: row.quotes || [],
    settings: (row.settings as Record<string, any>) || {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    schemaVersion: 1,
  };
}

export function mapSceneSchemaToInsert(
  schema: Omit<StorySceneSchema, 'id' | 'createdAt' | 'updatedAt' | 'schemaVersion'> & { id?: string }
): SceneInsert {
  return {
    id: schema.id,
    chapter_id: schema.chapterId,
    story_id: schema.storyId,
    scene_number: schema.sceneNumber ?? 1,
    title: schema.title,
    subtitle: schema.subtitle || null,
    description: schema.description || null,
    purpose: schema.purpose || null,
    story_segment: schema.storySegment || 'Opening Sequence',
    scene_type: schema.sceneType || 'Documentary',
    estimated_duration: schema.estimatedDuration || null,
    duration_seconds: schema.durationSeconds ?? 60,
    notes: schema.notes || null,
    status: schema.status || 'Draft',
    layout: schema.layout || 'standard',
    narration_text: schema.narrationText || null,
    narration_status: schema.narrationStatus || 'Draft',
    assigned_voice: schema.assignedVoice || null,
    estimated_reading_time: schema.estimatedReadingTime || null,
    music_track: schema.musicTrack || null,
    music_mood: schema.musicMood || null,
    music_volume: schema.musicVolume ?? 70,
    fade_in: schema.fadeIn ?? true,
    fade_out: schema.fadeOut ?? true,
    camera_movement: schema.cameraMovement || null,
    zoom_style: schema.zoomStyle || null,
    pan_direction: schema.panDirection || null,
    focus_point: schema.focusPoint || null,
    transition_type: schema.transitionType || null,
    primary_character_id: schema.primaryCharacterId || null,
    quotes: schema.quotes || [],
    settings: schema.settings ? (schema.settings as any) : {},
  };
}

export function mapSceneSchemaToUpdate(updates: Partial<StorySceneSchema>): SceneUpdate {
  const updatePayload: SceneUpdate = {};

  if (updates.chapterId !== undefined) updatePayload.chapter_id = updates.chapterId;
  if (updates.storyId !== undefined) updatePayload.story_id = updates.storyId;
  if (updates.sceneNumber !== undefined) updatePayload.scene_number = updates.sceneNumber;
  if (updates.title !== undefined) updatePayload.title = updates.title;
  if (updates.subtitle !== undefined) updatePayload.subtitle = updates.subtitle || null;
  if (updates.description !== undefined) updatePayload.description = updates.description || null;
  if (updates.purpose !== undefined) updatePayload.purpose = updates.purpose || null;
  if (updates.storySegment !== undefined) updatePayload.story_segment = updates.storySegment;
  if (updates.sceneType !== undefined) updatePayload.scene_type = updates.sceneType;
  if (updates.estimatedDuration !== undefined) updatePayload.estimated_duration = updates.estimatedDuration || null;
  if (updates.durationSeconds !== undefined) updatePayload.duration_seconds = updates.durationSeconds;
  if (updates.notes !== undefined) updatePayload.notes = updates.notes || null;
  if (updates.status !== undefined) updatePayload.status = updates.status;
  if (updates.layout !== undefined) updatePayload.layout = updates.layout;
  if (updates.narrationText !== undefined) updatePayload.narration_text = updates.narrationText || null;
  if (updates.narrationStatus !== undefined) updatePayload.narration_status = updates.narrationStatus;
  if (updates.assignedVoice !== undefined) updatePayload.assigned_voice = updates.assignedVoice || null;
  if (updates.estimatedReadingTime !== undefined) updatePayload.estimated_reading_time = updates.estimatedReadingTime || null;
  if (updates.musicTrack !== undefined) updatePayload.music_track = updates.musicTrack || null;
  if (updates.musicMood !== undefined) updatePayload.music_mood = updates.musicMood || null;
  if (updates.musicVolume !== undefined) updatePayload.music_volume = updates.musicVolume;
  if (updates.fadeIn !== undefined) updatePayload.fade_in = updates.fadeIn;
  if (updates.fadeOut !== undefined) updatePayload.fade_out = updates.fadeOut;
  if (updates.cameraMovement !== undefined) updatePayload.camera_movement = updates.cameraMovement || null;
  if (updates.zoomStyle !== undefined) updatePayload.zoom_style = updates.zoomStyle || null;
  if (updates.panDirection !== undefined) updatePayload.pan_direction = updates.panDirection || null;
  if (updates.focusPoint !== undefined) updatePayload.focus_point = updates.focusPoint || null;
  if (updates.transitionType !== undefined) updatePayload.transition_type = updates.transitionType || null;
  if (updates.primaryCharacterId !== undefined) updatePayload.primary_character_id = updates.primaryCharacterId || null;
  if (updates.quotes !== undefined) updatePayload.quotes = updates.quotes;
  if (updates.settings !== undefined) updatePayload.settings = updates.settings as any;

  return updatePayload;
}

// ==========================================
// 5. MEDIA ASSET MAPPERS
// ==========================================

export function mapMediaRowToSchema(row: MediaRow): MediaAssetSchema {
  return {
    id: row.id,
    name: row.name,
    type: row.media_type,
    category: row.categories?.[0] || 'Uncategorized',
    size: `${((row.file_size_bytes || 0) / (1024 * 1024)).toFixed(1)} MB`,
    bytes: row.file_size_bytes,
    resolution: row.resolution || undefined,
    duration: row.duration_seconds ? `${row.duration_seconds}s` : undefined,
    uploadDate: row.created_at,
    tags: row.tags || [],
    linkedStoryId: row.linked_story_id || '',
    linkedStoryName: '',
    linkedEvents: row.linked_events || [],
    linkedChapters: row.linked_chapters || [],
    favorite: row.favorite,
    status: row.status as any,
    thumbnailUrl: row.thumbnail_url || row.file_url,
    description: row.description || '',
    archived: row.archived,
    ownerId: row.user_id,
    profileId: row.profile_id,
    legacyProfileId: row.profile_id,
    displayName: row.display_name || undefined,
    originalFilename: row.original_filename || undefined,
    mimeType: row.mime_type,
    extension: row.extension || undefined,
    localStorageReference: row.file_url,
    categories: row.categories || [],
    metadata: (row.metadata as Record<string, any>) || {},
    version: 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    schemaVersion: 1,
  };
}

export function mapMediaSchemaToInsert(
  schema: Omit<MediaAssetSchema, 'id' | 'createdAt' | 'updatedAt' | 'schemaVersion'> & {
    id?: string;
    userId?: string;
    profileId?: string;
    fileUrl?: string;
    storagePath?: string;
  }
): MediaInsert {
  const fileUrl = schema.fileUrl || schema.thumbnailUrl || schema.localStorageReference || '';
  const storagePath = schema.storagePath || `${schema.userId || 'default'}/${schema.name}`;

  return {
    id: schema.id,
    profile_id: schema.profileId || schema.legacyProfileId || '',
    user_id: schema.ownerId || schema.userId || '',
    collection_id: null,
    linked_story_id: schema.linkedStoryId || null,
    name: schema.name,
    display_name: schema.displayName || schema.name,
    original_filename: schema.originalFilename || schema.name,
    file_url: fileUrl,
    storage_path: storagePath,
    media_type: (schema.type as any) || 'image',
    mime_type: schema.mimeType || 'image/jpeg',
    extension: schema.extension || null,
    file_size_bytes: schema.bytes || 0,
    width: null,
    height: null,
    resolution: schema.resolution || null,
    duration_seconds: schema.duration ? parseInt(schema.duration, 10) || null : null,
    thumbnail_url: schema.thumbnailUrl || null,
    description: schema.description || null,
    status: (schema.status as any) || 'Ready',
    favorite: schema.favorite ?? false,
    archived: schema.archived ?? false,
    tags: schema.tags || [],
    categories: schema.categories || [schema.category || 'General'],
    linked_events: schema.linkedEvents || [],
    linked_chapters: schema.linkedChapters || [],
    exif_data: {},
    ai_metadata: {},
    metadata: schema.metadata ? (schema.metadata as any) : {},
    captured_date: null,
    captured_location: null,
  };
}

export function mapMediaSchemaToUpdate(updates: Partial<MediaAssetSchema>): MediaUpdate {
  const updatePayload: MediaUpdate = {};

  if (updates.name !== undefined) updatePayload.name = updates.name;
  if (updates.displayName !== undefined) updatePayload.display_name = updates.displayName || null;
  if (updates.description !== undefined) updatePayload.description = updates.description || null;
  if (updates.type !== undefined) updatePayload.media_type = updates.type as any;
  if (updates.mimeType !== undefined) updatePayload.mime_type = updates.mimeType;
  if (updates.bytes !== undefined) updatePayload.file_size_bytes = updates.bytes;
  if (updates.resolution !== undefined) updatePayload.resolution = updates.resolution || null;
  if (updates.duration !== undefined) updatePayload.duration_seconds = updates.duration ? parseInt(updates.duration, 10) || null : null;
  if (updates.thumbnailUrl !== undefined) updatePayload.thumbnail_url = updates.thumbnailUrl || null;
  if (updates.status !== undefined) updatePayload.status = updates.status as any;
  if (updates.favorite !== undefined) updatePayload.favorite = updates.favorite;
  if (updates.archived !== undefined) updatePayload.archived = updates.archived;
  if (updates.tags !== undefined) updatePayload.tags = updates.tags;
  if (updates.categories !== undefined) updatePayload.categories = updates.categories;
  if (updates.linkedStoryId !== undefined) updatePayload.linked_story_id = updates.linkedStoryId || null;
  if (updates.linkedEvents !== undefined) updatePayload.linked_events = updates.linkedEvents;
  if (updates.linkedChapters !== undefined) updatePayload.linked_chapters = updates.linkedChapters;
  if (updates.metadata !== undefined) updatePayload.metadata = updates.metadata as any;

  return updatePayload;
}
