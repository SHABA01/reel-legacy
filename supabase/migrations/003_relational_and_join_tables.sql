-- ==============================================================================
-- REELLEGACY PRODUCTION DATABASE MIGRATION PACKAGE
-- Migration: 003_relational_and_join_tables.sql
-- Description: Relational junction tables, character graphs, timelines, voice profiles,
--              narration projects & segments, render jobs, templates, activity logs,
--              notifications, and story shares
-- Target Backend: Supabase / PostgreSQL 15+
-- ==============================================================================

-- 1. CHARACTER RELATIONSHIP GRAPH (Character-to-Character relational graph scoped to Story)
CREATE TABLE IF NOT EXISTS character_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    from_character_id UUID NOT NULL REFERENCES story_characters(id) ON DELETE CASCADE,
    to_character_id UUID NOT NULL REFERENCES story_characters(id) ON DELETE CASCADE,
    relation_type character_relation_type NOT NULL DEFAULT 'Other',
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_diff_characters CHECK (from_character_id <> to_character_id),
    CONSTRAINT uq_character_relationship UNIQUE (from_character_id, to_character_id, relation_type)
);

-- 2. STORY SCENE MEDIA M:N JUNCTION (Multiple media assets per scene with layering and roles)
CREATE TABLE IF NOT EXISTS story_scene_media (
    scene_id UUID NOT NULL REFERENCES story_scenes(id) ON DELETE CASCADE,
    media_asset_id UUID NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
    layer_order INTEGER NOT NULL DEFAULT 0,
    asset_role scene_asset_role NOT NULL DEFAULT 'primary',
    animation_effect TEXT DEFAULT 'none',
    caption TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (scene_id, media_asset_id)
);

-- 3. STORY SCENE CHARACTERS M:N JUNCTION (Multiple characters per scene with scene roles)
CREATE TABLE IF NOT EXISTS story_scene_characters (
    scene_id UUID NOT NULL REFERENCES story_scenes(id) ON DELETE CASCADE,
    character_id UUID NOT NULL REFERENCES story_characters(id) ON DELETE CASCADE,
    role_in_scene TEXT,
    appearance_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (scene_id, character_id)
);

-- 4. TIMELINE EVENTS
CREATE TABLE IF NOT EXISTS timeline_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES legacy_profiles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    story_id UUID REFERENCES stories(id) ON DELETE SET NULL,
    year TEXT NOT NULL,
    event_date DATE,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'general',
    event_type TEXT,
    location TEXT,
    importance TEXT NOT NULL DEFAULT 'Medium',
    milestone BOOLEAN NOT NULL DEFAULT false,
    people_involved TEXT[] NOT NULL DEFAULT '{}',
    supporting_media_ids UUID[] NOT NULL DEFAULT '{}',
    document_ids UUID[] NOT NULL DEFAULT '{}',
    tags TEXT[] NOT NULL DEFAULT '{}',
    categories TEXT[] NOT NULL DEFAULT '{}',
    visibility TEXT DEFAULT 'private',
    status TEXT DEFAULT 'active',
    sort_order INTEGER DEFAULT 0,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. VOICE PROFILES (System Presets & Custom AI Voice Clones)
CREATE TABLE IF NOT EXISTS voice_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    is_system_preset BOOLEAN NOT NULL DEFAULT false,
    name TEXT NOT NULL,
    title TEXT,
    category voice_category NOT NULL DEFAULT 'AI Voice Clone',
    avatar TEXT,
    gender voice_gender NOT NULL DEFAULT 'Neutral',
    age_group TEXT,
    accent TEXT NOT NULL DEFAULT 'Standard',
    description TEXT NOT NULL DEFAULT '',
    speed NUMERIC(4,2) NOT NULL DEFAULT 1.0 CHECK (speed >= 0.5 AND speed <= 2.0),
    pitch NUMERIC(4,2) NOT NULL DEFAULT 1.0 CHECK (pitch >= 0.5 AND pitch <= 1.5),
    stability INTEGER NOT NULL DEFAULT 75 CHECK (stability >= 0 AND stability <= 100),
    emotion voice_emotion NOT NULL DEFAULT 'Calm',
    pause_style TEXT NOT NULL DEFAULT 'Natural',
    tags TEXT[] NOT NULL DEFAULT '{}',
    sample_audio_url TEXT,
    settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. NARRATION PROJECTS (1:1 with Stories)
CREATE TABLE IF NOT EXISTS narration_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID NOT NULL UNIQUE REFERENCES stories(id) ON DELETE CASCADE,
    voice_profile_id UUID REFERENCES voice_profiles(id) ON DELETE SET NULL,
    voice_settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    pronunciation_rules JSONB NOT NULL DEFAULT '[]'::jsonb,
    background_music_track TEXT,
    music_ducking_db INTEGER NOT NULL DEFAULT -18,
    master_volume INTEGER NOT NULL DEFAULT 100 CHECK (master_volume >= 0 AND master_volume <= 100),
    status narration_status NOT NULL DEFAULT 'Draft',
    stats JSONB NOT NULL DEFAULT '{}'::jsonb,
    export_settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. NARRATION SEGMENTS (Scene-Level Narration with Multi-Take Versioning)
CREATE TABLE IF NOT EXISTS narration_segments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES narration_projects(id) ON DELETE CASCADE,
    scene_id UUID NOT NULL REFERENCES story_scenes(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL DEFAULT 0,
    act_title TEXT,
    chapter_title TEXT,
    scene_title TEXT,
    text TEXT NOT NULL,
    speaking_duration_estimate_sec INTEGER NOT NULL DEFAULT 0,
    actual_duration_sec INTEGER NOT NULL DEFAULT 0,
    word_count INTEGER NOT NULL DEFAULT 0,
    reading_difficulty TEXT NOT NULL DEFAULT 'Moderate',
    tone TEXT NOT NULL DEFAULT 'Warm',
    pronunciation_hints TEXT[] NOT NULL DEFAULT '{}',
    character_references TEXT[] NOT NULL DEFAULT '{}',
    timeline_references TEXT[] NOT NULL DEFAULT '{}',
    active_voice_id UUID REFERENCES voice_profiles(id) ON DELETE SET NULL,
    status narration_status NOT NULL DEFAULT 'Draft',
    active_version_id TEXT,
    versions JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtitles JSONB NOT NULL DEFAULT '[]'::jsonb,
    audio_quality_score INTEGER NOT NULL DEFAULT 100 CHECK (audio_quality_score >= 0 AND audio_quality_score <= 100),
    quality_issues JSONB NOT NULL DEFAULT '[]'::jsonb,
    music_ducking_db INTEGER NOT NULL DEFAULT -18,
    waveform_data NUMERIC[] NOT NULL DEFAULT '{}',
    ai_suggestions JSONB NOT NULL DEFAULT '[]'::jsonb,
    last_edited TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_narration_segment_scene UNIQUE (project_id, scene_id)
);

-- 8. RENDER JOBS (Production Video Pipeline Queue Engine)
CREATE TABLE IF NOT EXISTS render_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    story_name TEXT NOT NULL,
    version TEXT NOT NULL DEFAULT '1.0',
    type render_type NOT NULL DEFAULT 'documentary',
    resolution render_resolution NOT NULL DEFAULT '1080p',
    format TEXT NOT NULL DEFAULT 'MP4 (H.264)',
    status render_job_status NOT NULL DEFAULT 'queued',
    priority render_priority NOT NULL DEFAULT 'normal',
    progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    current_stage TEXT NOT NULL DEFAULT 'draft',
    stages JSONB NOT NULL DEFAULT '[]'::jsonb,
    preflight_checks JSONB NOT NULL DEFAULT '[]'::jsonb,
    duration_sec INTEGER NOT NULL DEFAULT 0,
    render_time_sec INTEGER NOT NULL DEFAULT 0,
    output_file_size_mb NUMERIC(10,2),
    output_destination TEXT NOT NULL DEFAULT 'Cloud Storage',
    output_file_url TEXT,
    thumbnail_url TEXT,
    assigned_template TEXT,
    profile_name TEXT NOT NULL DEFAULT '',
    logs TEXT[] NOT NULL DEFAULT '{}',
    ai_suggestions TEXT[] NOT NULL DEFAULT '{}',
    checksum TEXT,
    tags TEXT[] NOT NULL DEFAULT '{}',
    error_details TEXT,
    scheduled_for TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. STORY TEMPLATES (Blueprints, Interview Prompts, and Act Structures)
CREATE TABLE IF NOT EXISTS story_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    is_system_preset BOOLEAN NOT NULL DEFAULT false,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    cover_image TEXT,
    category TEXT NOT NULL DEFAULT 'Personal Biography',
    difficulty TEXT NOT NULL DEFAULT 'Beginner',
    estimated_runtime TEXT NOT NULL DEFAULT '10-15 mins',
    scene_count INTEGER NOT NULL DEFAULT 0,
    chapter_count INTEGER NOT NULL DEFAULT 0,
    act_count INTEGER NOT NULL DEFAULT 0,
    story_type TEXT NOT NULL DEFAULT 'Documentary',
    recommended_audience TEXT NOT NULL DEFAULT 'Family & Friends',
    popularity INTEGER NOT NULL DEFAULT 50 CHECK (popularity >= 0 AND popularity <= 100),
    ai_compatibility TEXT NOT NULL DEFAULT 'Full',
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_popular BOOLEAN NOT NULL DEFAULT false,
    is_community BOOLEAN NOT NULL DEFAULT false,
    is_favorite BOOLEAN NOT NULL DEFAULT false,
    rating NUMERIC(3,2) DEFAULT 5.0,
    tags TEXT[] NOT NULL DEFAULT '{}',
    narrative_blueprint JSONB NOT NULL DEFAULT '{}'::jsonb,
    version TEXT NOT NULL DEFAULT '1.0',
    version_history JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. ACTIVITY LOGS (Auditing & Domain History)
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES legacy_profiles(id) ON DELETE SET NULL,
    story_id UUID REFERENCES stories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_color TEXT NOT NULL DEFAULT 'bg-cinema-amber-500',
    action_type TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. NOTIFICATIONS (User-scoped in-app notifications)
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type notification_type NOT NULL DEFAULT 'info',
    is_read BOOLEAN NOT NULL DEFAULT false,
    action_url TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. STORY SHARES (Secure Tokenized Sharing with Access Boundary)
CREATE TABLE IF NOT EXISTS story_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    share_token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(24), 'hex'),
    access_level share_access_level NOT NULL DEFAULT 'view_only',
    password_protected BOOLEAN NOT NULL DEFAULT false,
    password_hash TEXT,
    expires_at TIMESTAMPTZ,
    view_count INTEGER NOT NULL DEFAULT 0 CHECK (view_count >= 0),
    max_views INTEGER,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
