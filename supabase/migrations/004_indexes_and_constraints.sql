-- ==============================================================================
-- REELLEGACY PRODUCTION DATABASE MIGRATION PACKAGE
-- Migration: 004_indexes_and_constraints.sql
-- Description: Performance indexing, foreign key indexes, trigram search, and compound indexes
-- Target Backend: Supabase / PostgreSQL 15+
-- ==============================================================================

-- 1. FOREIGN KEY & JOIN INDEXES

-- Legacy Profiles & User Settings
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_legacy_profiles_user_id ON legacy_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_legacy_profiles_status ON legacy_profiles(status);
CREATE INDEX IF NOT EXISTS idx_legacy_profiles_category ON legacy_profiles(category);
CREATE INDEX IF NOT EXISTS idx_legacy_profiles_life_status ON legacy_profiles(life_status);

-- Media Collections
CREATE INDEX IF NOT EXISTS idx_media_collections_profile_id ON media_collections(profile_id);
CREATE INDEX IF NOT EXISTS idx_media_collections_user_id ON media_collections(user_id);

-- Stories
CREATE INDEX IF NOT EXISTS idx_stories_profile_id ON stories(profile_id);
CREATE INDEX IF NOT EXISTS idx_stories_user_id ON stories(user_id);
CREATE INDEX IF NOT EXISTS idx_stories_status ON stories(status);
CREATE INDEX IF NOT EXISTS idx_stories_category ON stories(category);
CREATE INDEX IF NOT EXISTS idx_stories_created_at ON stories(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stories_pinned ON stories(pinned) WHERE pinned = true;

-- Story Characters
CREATE INDEX IF NOT EXISTS idx_story_characters_story_id ON story_characters(story_id);
CREATE INDEX IF NOT EXISTS idx_story_characters_profile_id ON story_characters(legacy_profile_id);
CREATE INDEX IF NOT EXISTS idx_story_characters_role ON story_characters(story_role);
CREATE INDEX IF NOT EXISTS idx_story_characters_status ON story_characters(status);

-- Character Relationships
CREATE INDEX IF NOT EXISTS idx_char_rel_story ON character_relationships(story_id);
CREATE INDEX IF NOT EXISTS idx_char_rel_from ON character_relationships(from_character_id);
CREATE INDEX IF NOT EXISTS idx_char_rel_to ON character_relationships(to_character_id);

-- Media Assets
CREATE INDEX IF NOT EXISTS idx_media_assets_profile_id ON media_assets(profile_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_user_id ON media_assets(user_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_collection_id ON media_assets(collection_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_linked_story ON media_assets(linked_story_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_media_type ON media_assets(media_type);
CREATE INDEX IF NOT EXISTS idx_media_assets_status ON media_assets(status);
CREATE INDEX IF NOT EXISTS idx_media_assets_captured_date ON media_assets(captured_date DESC);

-- Source Documents & Imports
CREATE INDEX IF NOT EXISTS idx_source_docs_profile_id ON source_documents(profile_id);
CREATE INDEX IF NOT EXISTS idx_source_docs_user_id ON source_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_source_docs_story_id ON source_documents(story_id);
CREATE INDEX IF NOT EXISTS idx_source_docs_category ON source_documents(category);

CREATE INDEX IF NOT EXISTS idx_source_imports_profile_id ON source_imports(profile_id);
CREATE INDEX IF NOT EXISTS idx_source_imports_user_id ON source_imports(user_id);
CREATE INDEX IF NOT EXISTS idx_source_imports_story_id ON source_imports(story_id);
CREATE INDEX IF NOT EXISTS idx_source_imports_status ON source_imports(import_status);

-- Story Chapters & Scenes (Compound Hierarchy Indexes)
CREATE INDEX IF NOT EXISTS idx_story_chapters_story_id ON story_chapters(story_id);
CREATE INDEX IF NOT EXISTS idx_story_chapters_order ON story_chapters(story_id, order_index ASC);

CREATE INDEX IF NOT EXISTS idx_story_scenes_chapter_id ON story_scenes(chapter_id);
CREATE INDEX IF NOT EXISTS idx_story_scenes_story_id ON story_scenes(story_id);
CREATE INDEX IF NOT EXISTS idx_story_scenes_order ON story_scenes(chapter_id, scene_number ASC);
CREATE INDEX IF NOT EXISTS idx_story_scenes_status ON story_scenes(status);

-- Scene Junctions
CREATE INDEX IF NOT EXISTS idx_scene_media_scene ON story_scene_media(scene_id);
CREATE INDEX IF NOT EXISTS idx_scene_media_asset ON story_scene_media(media_asset_id);
CREATE INDEX IF NOT EXISTS idx_scene_media_order ON story_scene_media(scene_id, layer_order ASC);

CREATE INDEX IF NOT EXISTS idx_scene_chars_scene ON story_scene_characters(scene_id);
CREATE INDEX IF NOT EXISTS idx_scene_chars_char ON story_scene_characters(character_id);

-- Timeline Events
CREATE INDEX IF NOT EXISTS idx_timeline_events_profile ON timeline_events(profile_id);
CREATE INDEX IF NOT EXISTS idx_timeline_events_user ON timeline_events(user_id);
CREATE INDEX IF NOT EXISTS idx_timeline_events_story ON timeline_events(story_id);
CREATE INDEX IF NOT EXISTS idx_timeline_events_date ON timeline_events(profile_id, event_date ASC);
CREATE INDEX IF NOT EXISTS idx_timeline_events_year ON timeline_events(profile_id, year ASC);

-- Voice & Narration
CREATE INDEX IF NOT EXISTS idx_voice_profiles_user ON voice_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_voice_profiles_system ON voice_profiles(is_system_preset) WHERE is_system_preset = true;

CREATE INDEX IF NOT EXISTS idx_narration_projects_story ON narration_projects(story_id);
CREATE INDEX IF NOT EXISTS idx_narration_projects_voice ON narration_projects(voice_profile_id);

CREATE INDEX IF NOT EXISTS idx_narration_segments_project ON narration_segments(project_id);
CREATE INDEX IF NOT EXISTS idx_narration_segments_scene ON narration_segments(scene_id);
CREATE INDEX IF NOT EXISTS idx_narration_segments_order ON narration_segments(project_id, order_index ASC);

-- Render Jobs
CREATE INDEX IF NOT EXISTS idx_render_jobs_story ON render_jobs(story_id);
CREATE INDEX IF NOT EXISTS idx_render_jobs_user ON render_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_render_jobs_status ON render_jobs(status);
CREATE INDEX IF NOT EXISTS idx_render_jobs_active ON render_jobs(status) WHERE status IN ('preflight', 'queued', 'running');

-- Templates
CREATE INDEX IF NOT EXISTS idx_story_templates_author ON story_templates(author_user_id);
CREATE INDEX IF NOT EXISTS idx_story_templates_system ON story_templates(is_system_preset) WHERE is_system_preset = true;
CREATE INDEX IF NOT EXISTS idx_story_templates_category ON story_templates(category);

-- Activity Logs & Notifications
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_profile ON activity_logs(profile_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_story ON activity_logs(story_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, created_at DESC) WHERE is_read = false;

-- Story Shares
CREATE INDEX IF NOT EXISTS idx_story_shares_story ON story_shares(story_id);
CREATE INDEX IF NOT EXISTS idx_story_shares_token ON story_shares(share_token) WHERE is_active = true;

-- 2. FULL-TEXT AND TRIGRAM SEARCH INDEXES (pg_trgm)

CREATE INDEX IF NOT EXISTS idx_profiles_name_trgm ON legacy_profiles USING gin ((first_name || ' ' || last_name) gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_stories_title_trgm ON stories USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_characters_name_trgm ON story_characters USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_media_assets_name_trgm ON media_assets USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_source_docs_name_trgm ON source_documents USING gin (display_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_timeline_title_trgm ON timeline_events USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_story_templates_name_trgm ON story_templates USING gin (name gin_trgm_ops);
