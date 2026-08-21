-- ==============================================================================
-- REELLEGACY PRODUCTION DATABASE MIGRATION PACKAGE
-- Migration: 006A_triggers_and_auth.sql
-- Description: Automated timestamp triggers, profile & settings bootstrap on signup
-- Target Backend: Supabase / PostgreSQL 15+
-- ==============================================================================

-- 1. AUTOMATIC UPDATED_AT TRIGGER FUNCTION

CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. APPLY UPDATED_AT TRIGGERS TO ALL MUTABLE ENTITY TABLES

DROP TRIGGER IF EXISTS trg_user_settings_updated_at ON user_settings;
CREATE TRIGGER trg_user_settings_updated_at
    BEFORE UPDATE ON user_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON legacy_profiles;
CREATE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON legacy_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS trg_media_collections_updated_at ON media_collections;
CREATE TRIGGER trg_media_collections_updated_at
    BEFORE UPDATE ON media_collections
    FOR EACH ROW
    EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS trg_stories_updated_at ON stories;
CREATE TRIGGER trg_stories_updated_at
    BEFORE UPDATE ON stories
    FOR EACH ROW
    EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS trg_story_characters_updated_at ON story_characters;
CREATE TRIGGER trg_story_characters_updated_at
    BEFORE UPDATE ON story_characters
    FOR EACH ROW
    EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS trg_media_assets_updated_at ON media_assets;
CREATE TRIGGER trg_media_assets_updated_at
    BEFORE UPDATE ON media_assets
    FOR EACH ROW
    EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS trg_source_docs_updated_at ON source_documents;
CREATE TRIGGER trg_source_docs_updated_at
    BEFORE UPDATE ON source_documents
    FOR EACH ROW
    EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS trg_source_imports_updated_at ON source_imports;
CREATE TRIGGER trg_source_imports_updated_at
    BEFORE UPDATE ON source_imports
    FOR EACH ROW
    EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS trg_story_chapters_updated_at ON story_chapters;
CREATE TRIGGER trg_story_chapters_updated_at
    BEFORE UPDATE ON story_chapters
    FOR EACH ROW
    EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS trg_story_scenes_updated_at ON story_scenes;
CREATE TRIGGER trg_story_scenes_updated_at
    BEFORE UPDATE ON story_scenes
    FOR EACH ROW
    EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS trg_timeline_events_updated_at ON timeline_events;
CREATE TRIGGER trg_timeline_events_updated_at
    BEFORE UPDATE ON timeline_events
    FOR EACH ROW
    EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS trg_voice_profiles_updated_at ON voice_profiles;
CREATE TRIGGER trg_voice_profiles_updated_at
    BEFORE UPDATE ON voice_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS trg_narration_projects_updated_at ON narration_projects;
CREATE TRIGGER trg_narration_projects_updated_at
    BEFORE UPDATE ON narration_projects
    FOR EACH ROW
    EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS trg_narration_segments_updated_at ON narration_segments;
CREATE TRIGGER trg_narration_segments_updated_at
    BEFORE UPDATE ON narration_segments
    FOR EACH ROW
    EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS trg_render_jobs_updated_at ON render_jobs;
CREATE TRIGGER trg_render_jobs_updated_at
    BEFORE UPDATE ON render_jobs
    FOR EACH ROW
    EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS trg_story_templates_updated_at ON story_templates;
CREATE TRIGGER trg_story_templates_updated_at
    BEFORE UPDATE ON story_templates
    FOR EACH ROW
    EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS trg_story_shares_updated_at ON story_shares;
CREATE TRIGGER trg_story_shares_updated_at
    BEFORE UPDATE ON story_shares
    FOR EACH ROW
    EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- 3. USER SIGNUP BOOTSTRAP TRIGGER
-- Automatically provisions default User Settings and Legacy Profile when an auth user registers

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Provision user settings
    INSERT INTO public.user_settings (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;

    -- Provision default legacy profile if none exists for this user
    IF NOT EXISTS (SELECT 1 FROM public.legacy_profiles WHERE user_id = NEW.id) THEN
        INSERT INTO public.legacy_profiles (
            user_id,
            first_name,
            last_name,
            date_of_birth,
            biography_summary
        )
        VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'first_name', 'My'),
            COALESCE(NEW.raw_user_meta_data->>'last_name', 'Heritage'),
            COALESCE((NEW.raw_user_meta_data->>'date_of_birth')::DATE, '1970-01-01'::DATE),
            NEW.raw_user_meta_data->>'biography_summary'
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Attach trigger to auth.users if permissions allow
DO $$ BEGIN
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW
        EXECUTE FUNCTION public.handle_new_user();
EXCEPTION
    WHEN insufficient_privilege THEN
        RAISE NOTICE 'Skipping auth.users trigger setup due to limited migration privileges. Handle profile bootstrap via application logic or Supabase dashboard.';
    WHEN undefined_table THEN
        RAISE NOTICE 'auth.users table not found in current schema context.';
END $$;
