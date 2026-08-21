-- ==============================================================================
-- REELLEGACY PRODUCTION DATABASE MIGRATION PACKAGE
-- Migration: 001_extensions_and_types.sql
-- Description: Core PostgreSQL extensions, custom domains, and enumerated types
-- Target Backend: Supabase / PostgreSQL 15+
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. ENUMERATED TYPES

-- Legacy Profile Life & Entity Categorization
DO $$ BEGIN
    CREATE TYPE life_status AS ENUM ('living', 'memorial', 'historical');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE profile_category AS ENUM (
        'personal',
        'autobiography',
        'memorial',
        'celebration',
        'career',
        'family-history',
        'historical-figure',
        'organization',
        'community'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE profile_status AS ENUM ('draft', 'published', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Story Lifecycle & Status
DO $$ BEGIN
    CREATE TYPE story_status AS ENUM (
        'draft',
        'in_progress',
        'ready_to_render',
        'rendered',
        'published',
        'archived'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Media Assets
DO $$ BEGIN
    CREATE TYPE media_type AS ENUM ('image', 'video', 'audio', 'document');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE media_status AS ENUM ('Ready', 'Optimizing', 'Needs Metadata', 'Flagged');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Source Documents & Imports
DO $$ BEGIN
    CREATE TYPE document_category AS ENUM (
        'legal',
        'genealogy',
        'personal_letter',
        'newspaper_clip',
        'military_record',
        'journal',
        'transcript',
        'other'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE import_status AS ENUM ('Pending', 'Processed', 'Failed', 'Archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Character & Relationship Domain Types
DO $$ BEGIN
    CREATE TYPE character_role AS ENUM (
        'Main Subject',
        'Parent',
        'Spouse',
        'Child',
        'Sibling',
        'Friend',
        'Colleague',
        'Mentor',
        'Relative',
        'Historical Figure',
        'Interviewee',
        'Narrator',
        'Other'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE character_importance AS ENUM ('High', 'Medium', 'Low');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE character_status AS ENUM ('Active', 'Draft', 'Archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE character_relation_type AS ENUM (
        'Parent',
        'Child',
        'Spouse',
        'Sibling',
        'Grandparent',
        'Grandchild',
        'Friend',
        'Colleague',
        'Mentor',
        'Relative',
        'Historical Connection',
        'Other'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Scene Structure & Layout
DO $$ BEGIN
    CREATE TYPE scene_layout AS ENUM (
        'standard',
        'split_screen',
        'picture_in_picture',
        'full_bleed',
        'slideshow',
        'interview_cut',
        'photo_montage',
        'archival_spotlight'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE scene_status AS ENUM (
        'Draft',
        'Needs Media',
        'Needs Narration',
        'Ready',
        'Locked',
        'Completed'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE scene_asset_role AS ENUM (
        'primary',
        'background',
        'b_roll',
        'overlay',
        'document',
        'audio'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Voice & Narration Domain Types
DO $$ BEGIN
    CREATE TYPE voice_category AS ENUM (
        'Family Member',
        'Documentary Narrator',
        'AI Voice Clone',
        'Historical Voice'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE voice_gender AS ENUM ('Male', 'Female', 'Neutral');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE voice_emotion AS ENUM (
        'Warm',
        'Solemn',
        'Nostalgic',
        'Dramatic',
        'Authoritative',
        'Inspirational',
        'Calm'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE narration_status AS ENUM (
        'Draft',
        'Needs Recording',
        'Recorded',
        'AI Generated',
        'Synced',
        'Approved'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE version_type AS ENUM (
        'original',
        'edited',
        'enhanced',
        'ai_generated',
        'alternative_take'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Render Job & Production Pipeline Types
DO $$ BEGIN
    CREATE TYPE render_job_status AS ENUM (
        'draft',
        'preflight',
        'queued',
        'running',
        'paused',
        'completed',
        'failed',
        'cancelled',
        'scheduled',
        'archived'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE render_type AS ENUM (
        'documentary',
        'trailer',
        'vertical_reel',
        'audio_podcast',
        'memoir_pdf',
        'zip_archive',
        'subtitle_export',
        'transcript_export',
        'voice_package',
        'image_slideshow'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE render_resolution AS ENUM (
        '720p',
        '1080p',
        '4K',
        '9:16 HD',
        'Audio Only',
        'Print PDF'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE render_priority AS ENUM ('low', 'normal', 'high', 'urgent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Notifications & Sharing
DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM ('info', 'success', 'warning', 'error');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE share_access_level AS ENUM ('view_only', 'comment', 'collaborate');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
