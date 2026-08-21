-- ==============================================================================
-- REELLEGACY PRODUCTION DATABASE MIGRATION PACKAGE
-- Migration: 005_rls_security_policies.sql
-- Description: Hardened Row Level Security (RLS) policies and security definer functions
-- Target Backend: Supabase / PostgreSQL 15+
-- ==============================================================================

-- ==============================================================================
-- 1. SECURITY DEFINER HELPER FUNCTIONS (WITH ISOLATED SEARCH PATH & ACCESS CONTROL)
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.owns_profile(p_profile_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.legacy_profiles
        WHERE id = p_profile_id AND user_id = auth.uid()
    );
$$;

CREATE OR REPLACE FUNCTION public.owns_story(p_story_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.stories
        WHERE id = p_story_id 
          AND user_id = auth.uid() 
          AND public.owns_profile(profile_id)
    );
$$;

CREATE OR REPLACE FUNCTION public.owns_chapter(p_chapter_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.story_chapters c
        WHERE c.id = p_chapter_id AND public.owns_story(c.story_id)
    );
$$;

CREATE OR REPLACE FUNCTION public.owns_scene(p_scene_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.story_scenes sc
        WHERE sc.id = p_scene_id AND public.owns_story(sc.story_id)
    );
$$;

CREATE OR REPLACE FUNCTION public.owns_character(p_character_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.story_characters ch
        WHERE ch.id = p_character_id AND public.owns_story(ch.story_id)
    );
$$;

CREATE OR REPLACE FUNCTION public.owns_narration_project(p_project_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.narration_projects np
        WHERE np.id = p_project_id AND public.owns_story(np.story_id)
    );
$$;

-- Restrict execution of internal authorization helpers to authenticated users and service_role
REVOKE EXECUTE ON FUNCTION public.owns_profile(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.owns_profile(UUID) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.owns_story(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.owns_story(UUID) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.owns_chapter(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.owns_chapter(UUID) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.owns_scene(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.owns_scene(UUID) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.owns_character(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.owns_character(UUID) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.owns_narration_project(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.owns_narration_project(UUID) TO authenticated, service_role;

-- ==============================================================================
-- 2. ENABLE ROW LEVEL SECURITY ON ALL 22 CANONICAL TABLES
-- ==============================================================================

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE legacy_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE source_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE source_imports ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_scene_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_scene_characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE narration_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE narration_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE render_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_shares ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 3. HARDENED ROW LEVEL SECURITY POLICIES
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- Table 1: user_settings
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can manage own settings" ON user_settings;
CREATE POLICY "Users can manage own settings"
    ON user_settings FOR ALL
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- ------------------------------------------------------------------------------
-- Table 2: legacy_profiles
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own legacy profiles" ON legacy_profiles;
CREATE POLICY "Users can view own legacy profiles"
    ON legacy_profiles FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create own legacy profiles" ON legacy_profiles;
CREATE POLICY "Users can create own legacy profiles"
    ON legacy_profiles FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own legacy profiles" ON legacy_profiles;
CREATE POLICY "Users can update own legacy profiles"
    ON legacy_profiles FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own legacy profiles" ON legacy_profiles;
CREATE POLICY "Users can delete own legacy profiles"
    ON legacy_profiles FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

-- ------------------------------------------------------------------------------
-- Table 3: media_collections
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can manage own media collections" ON media_collections;
CREATE POLICY "Users can manage own media collections"
    ON media_collections FOR ALL
    TO authenticated
    USING (user_id = auth.uid() AND public.owns_profile(profile_id))
    WITH CHECK (user_id = auth.uid() AND public.owns_profile(profile_id));

-- ------------------------------------------------------------------------------
-- Table 4: stories
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can manage own stories" ON stories;
CREATE POLICY "Users can manage own stories"
    ON stories FOR ALL
    TO authenticated
    USING (user_id = auth.uid() AND public.owns_profile(profile_id))
    WITH CHECK (user_id = auth.uid() AND public.owns_profile(profile_id));

-- ------------------------------------------------------------------------------
-- Table 5: story_characters
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can manage characters of owned stories" ON story_characters;
CREATE POLICY "Users can manage characters of owned stories"
    ON story_characters FOR ALL
    TO authenticated
    USING (
        public.owns_story(story_id) 
        AND (legacy_profile_id IS NULL OR public.owns_profile(legacy_profile_id))
    )
    WITH CHECK (
        public.owns_story(story_id) 
        AND (legacy_profile_id IS NULL OR public.owns_profile(legacy_profile_id))
    );

-- ------------------------------------------------------------------------------
-- Table 6: character_relationships
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can manage character relationships of owned stories" ON character_relationships;
CREATE POLICY "Users can manage character relationships of owned stories"
    ON character_relationships FOR ALL
    TO authenticated
    USING (
        public.owns_story(story_id)
        AND EXISTS (
            SELECT 1 FROM public.story_characters c1 
            WHERE c1.id = from_character_id AND c1.story_id = character_relationships.story_id
        )
        AND EXISTS (
            SELECT 1 FROM public.story_characters c2 
            WHERE c2.id = to_character_id AND c2.story_id = character_relationships.story_id
        )
    )
    WITH CHECK (
        public.owns_story(story_id)
        AND EXISTS (
            SELECT 1 FROM public.story_characters c1 
            WHERE c1.id = from_character_id AND c1.story_id = character_relationships.story_id
        )
        AND EXISTS (
            SELECT 1 FROM public.story_characters c2 
            WHERE c2.id = to_character_id AND c2.story_id = character_relationships.story_id
        )
    );

-- ------------------------------------------------------------------------------
-- Table 7: story_chapters
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can manage chapters of owned stories" ON story_chapters;
CREATE POLICY "Users can manage chapters of owned stories"
    ON story_chapters FOR ALL
    TO authenticated
    USING (public.owns_story(story_id))
    WITH CHECK (public.owns_story(story_id));

-- ------------------------------------------------------------------------------
-- Table 8: story_scenes
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can manage scenes of owned stories" ON story_scenes;
CREATE POLICY "Users can manage scenes of owned stories"
    ON story_scenes FOR ALL
    TO authenticated
    USING (
        public.owns_story(story_id)
        AND EXISTS (
            SELECT 1 FROM public.story_chapters sc
            WHERE sc.id = chapter_id AND sc.story_id = story_scenes.story_id
        )
        AND (primary_character_id IS NULL OR EXISTS (
            SELECT 1 FROM public.story_characters ch
            WHERE ch.id = primary_character_id AND ch.story_id = story_scenes.story_id
        ))
    )
    WITH CHECK (
        public.owns_story(story_id)
        AND EXISTS (
            SELECT 1 FROM public.story_chapters sc
            WHERE sc.id = chapter_id AND sc.story_id = story_scenes.story_id
        )
        AND (primary_character_id IS NULL OR EXISTS (
            SELECT 1 FROM public.story_characters ch
            WHERE ch.id = primary_character_id AND ch.story_id = story_scenes.story_id
        ))
    );

-- ------------------------------------------------------------------------------
-- Table 9: story_scene_media
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can manage scene media of owned scenes" ON story_scene_media;
CREATE POLICY "Users can manage scene media of owned scenes"
    ON story_scene_media FOR ALL
    TO authenticated
    USING (
        public.owns_scene(scene_id)
        AND EXISTS (
            SELECT 1 FROM public.media_assets ma
            WHERE ma.id = media_asset_id 
              AND ma.user_id = auth.uid()
              AND public.owns_profile(ma.profile_id)
        )
    )
    WITH CHECK (
        public.owns_scene(scene_id)
        AND EXISTS (
            SELECT 1 FROM public.media_assets ma
            WHERE ma.id = media_asset_id 
              AND ma.user_id = auth.uid()
              AND public.owns_profile(ma.profile_id)
        )
    );

-- ------------------------------------------------------------------------------
-- Table 10: story_scene_characters
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can manage scene characters of owned scenes" ON story_scene_characters;
CREATE POLICY "Users can manage scene characters of owned scenes"
    ON story_scene_characters FOR ALL
    TO authenticated
    USING (
        public.owns_scene(scene_id)
        AND EXISTS (
            SELECT 1 FROM public.story_characters ch
            JOIN public.story_scenes sc ON sc.id = scene_id
            WHERE ch.id = character_id AND ch.story_id = sc.story_id
        )
    )
    WITH CHECK (
        public.owns_scene(scene_id)
        AND EXISTS (
            SELECT 1 FROM public.story_characters ch
            JOIN public.story_scenes sc ON sc.id = scene_id
            WHERE ch.id = character_id AND ch.story_id = sc.story_id
        )
    );

-- ------------------------------------------------------------------------------
-- Table 11: media_assets
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can manage own media assets" ON media_assets;
CREATE POLICY "Users can manage own media assets"
    ON media_assets FOR ALL
    TO authenticated
    USING (
        user_id = auth.uid() 
        AND public.owns_profile(profile_id)
        AND (linked_story_id IS NULL OR public.owns_story(linked_story_id))
        AND (collection_id IS NULL OR EXISTS (
            SELECT 1 FROM public.media_collections mc
            WHERE mc.id = collection_id AND mc.user_id = auth.uid() AND mc.profile_id = media_assets.profile_id
        ))
    )
    WITH CHECK (
        user_id = auth.uid() 
        AND public.owns_profile(profile_id)
        AND (linked_story_id IS NULL OR public.owns_story(linked_story_id))
        AND (collection_id IS NULL OR EXISTS (
            SELECT 1 FROM public.media_collections mc
            WHERE mc.id = collection_id AND mc.user_id = auth.uid() AND mc.profile_id = media_assets.profile_id
        ))
    );

-- ------------------------------------------------------------------------------
-- Table 12: source_documents
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can manage own source documents" ON source_documents;
CREATE POLICY "Users can manage own source documents"
    ON source_documents FOR ALL
    TO authenticated
    USING (
        user_id = auth.uid() 
        AND public.owns_profile(profile_id)
        AND (story_id IS NULL OR public.owns_story(story_id))
    )
    WITH CHECK (
        user_id = auth.uid() 
        AND public.owns_profile(profile_id)
        AND (story_id IS NULL OR public.owns_story(story_id))
    );

-- ------------------------------------------------------------------------------
-- Table 13: source_imports
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can manage own source imports" ON source_imports;
CREATE POLICY "Users can manage own source imports"
    ON source_imports FOR ALL
    TO authenticated
    USING (
        user_id = auth.uid() 
        AND public.owns_profile(profile_id)
        AND (story_id IS NULL OR public.owns_story(story_id))
    )
    WITH CHECK (
        user_id = auth.uid() 
        AND public.owns_profile(profile_id)
        AND (story_id IS NULL OR public.owns_story(story_id))
    );

-- ------------------------------------------------------------------------------
-- Table 14: timeline_events
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can manage own timeline events" ON timeline_events;
CREATE POLICY "Users can manage own timeline events"
    ON timeline_events FOR ALL
    TO authenticated
    USING (
        user_id = auth.uid() 
        AND public.owns_profile(profile_id)
        AND (story_id IS NULL OR public.owns_story(story_id))
    )
    WITH CHECK (
        user_id = auth.uid() 
        AND public.owns_profile(profile_id)
        AND (story_id IS NULL OR public.owns_story(story_id))
    );

-- ------------------------------------------------------------------------------
-- Table 15: voice_profiles
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view preset and own voice profiles" ON voice_profiles;
CREATE POLICY "Users can view preset and own voice profiles"
    ON voice_profiles FOR SELECT
    TO authenticated
    USING (is_system_preset = true OR user_id = auth.uid());

DROP POLICY IF EXISTS "Users can manage own custom voice profiles" ON voice_profiles;
CREATE POLICY "Users can insert own custom voice profiles"
    ON voice_profiles FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid() AND is_system_preset = false);

DROP POLICY IF EXISTS "Users can update own custom voice profiles" ON voice_profiles;
CREATE POLICY "Users can update own custom voice profiles"
    ON voice_profiles FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid() AND is_system_preset = false)
    WITH CHECK (user_id = auth.uid() AND is_system_preset = false);

DROP POLICY IF EXISTS "Users can delete own custom voice profiles" ON voice_profiles;
CREATE POLICY "Users can delete own custom voice profiles"
    ON voice_profiles FOR DELETE
    TO authenticated
    USING (user_id = auth.uid() AND is_system_preset = false);

-- ------------------------------------------------------------------------------
-- Table 16: narration_projects
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can manage narration projects of owned stories" ON narration_projects;
CREATE POLICY "Users can manage narration projects of owned stories"
    ON narration_projects FOR ALL
    TO authenticated
    USING (
        public.owns_story(story_id)
        AND (voice_profile_id IS NULL OR EXISTS (
            SELECT 1 FROM public.voice_profiles vp 
            WHERE vp.id = voice_profile_id AND (vp.is_system_preset = true OR vp.user_id = auth.uid())
        ))
    )
    WITH CHECK (
        public.owns_story(story_id)
        AND (voice_profile_id IS NULL OR EXISTS (
            SELECT 1 FROM public.voice_profiles vp 
            WHERE vp.id = voice_profile_id AND (vp.is_system_preset = true OR vp.user_id = auth.uid())
        ))
    );

-- ------------------------------------------------------------------------------
-- Table 17: narration_segments
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can manage narration segments of owned projects" ON narration_segments;
CREATE POLICY "Users can manage narration segments of owned projects"
    ON narration_segments FOR ALL
    TO authenticated
    USING (
        public.owns_narration_project(project_id)
        AND (scene_id IS NULL OR EXISTS (
            SELECT 1 FROM public.narration_projects np
            JOIN public.story_scenes sc ON sc.story_id = np.story_id
            WHERE np.id = narration_segments.project_id AND sc.id = narration_segments.scene_id
        ))
        AND (active_voice_id IS NULL OR EXISTS (
            SELECT 1 FROM public.voice_profiles vp 
            WHERE vp.id = active_voice_id AND (vp.is_system_preset = true OR vp.user_id = auth.uid())
        ))
    )
    WITH CHECK (
        public.owns_narration_project(project_id)
        AND (scene_id IS NULL OR EXISTS (
            SELECT 1 FROM public.narration_projects np
            JOIN public.story_scenes sc ON sc.story_id = np.story_id
            WHERE np.id = narration_segments.project_id AND sc.id = narration_segments.scene_id
        ))
        AND (active_voice_id IS NULL OR EXISTS (
            SELECT 1 FROM public.voice_profiles vp 
            WHERE vp.id = active_voice_id AND (vp.is_system_preset = true OR vp.user_id = auth.uid())
        ))
    );

-- ------------------------------------------------------------------------------
-- Table 18: render_jobs
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can manage own render jobs" ON render_jobs;
CREATE POLICY "Users can manage own render jobs"
    ON render_jobs FOR ALL
    TO authenticated
    USING (user_id = auth.uid() AND public.owns_story(story_id))
    WITH CHECK (user_id = auth.uid() AND public.owns_story(story_id));

-- ------------------------------------------------------------------------------
-- Table 19: story_templates
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view preset, community, and own templates" ON story_templates;
CREATE POLICY "Users can view preset, community, and own templates"
    ON story_templates FOR SELECT
    TO authenticated
    USING (is_system_preset = true OR is_community = true OR author_user_id = auth.uid());

DROP POLICY IF EXISTS "Users can manage own custom templates" ON story_templates;
CREATE POLICY "Users can insert own custom templates"
    ON story_templates FOR INSERT
    TO authenticated
    WITH CHECK (author_user_id = auth.uid() AND is_system_preset = false AND is_community = false);

DROP POLICY IF EXISTS "Users can update own custom templates" ON story_templates;
CREATE POLICY "Users can update own custom templates"
    ON story_templates FOR UPDATE
    TO authenticated
    USING (author_user_id = auth.uid() AND is_system_preset = false AND is_community = false)
    WITH CHECK (author_user_id = auth.uid() AND is_system_preset = false AND is_community = false);

DROP POLICY IF EXISTS "Users can delete own custom templates" ON story_templates;
CREATE POLICY "Users can delete own custom templates"
    ON story_templates FOR DELETE
    TO authenticated
    USING (author_user_id = auth.uid() AND is_system_preset = false AND is_community = false);

-- ------------------------------------------------------------------------------
-- Table 20: activity_logs (Append-Only Audit Trail)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can manage own activity logs" ON activity_logs;
CREATE POLICY "Users can view own activity logs"
    ON activity_logs FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can append own activity logs"
    ON activity_logs FOR INSERT
    TO authenticated
    WITH CHECK (
        user_id = auth.uid()
        AND (profile_id IS NULL OR public.owns_profile(profile_id))
        AND (story_id IS NULL OR public.owns_story(story_id))
    );

-- ------------------------------------------------------------------------------
-- Table 21: notifications (System-Generated Notifications)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can manage own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can insert own notifications" ON notifications;
CREATE POLICY "Users can view own notifications"
    ON notifications FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
    ON notifications FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own notifications"
    ON notifications FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

-- ------------------------------------------------------------------------------
-- Table 22: story_shares
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Owners can manage story shares" ON story_shares;
CREATE POLICY "Owners can manage story shares"
    ON story_shares FOR ALL
    TO authenticated
    USING (created_by = auth.uid() AND public.owns_story(story_id))
    WITH CHECK (created_by = auth.uid() AND public.owns_story(story_id));

-- Eliminate open table-level SELECT on story_shares for anonymous users
DROP POLICY IF EXISTS "Public token holders can view active share details" ON story_shares;

-- ==============================================================================
-- 4. SECURE STORY SHARE RESOLUTION RPC (TOKEN-GATED ACCESS)
-- ==============================================================================

-- Security Note on Password Protection & Abuse Prevention:
-- This database function is responsible ONLY for cryptographic token validation,
-- expiration checking, and view counter telemetry. It NEVER accepts client-side
-- password hashes or exposes stored password_hash values.
-- Password verification for protected shares and IP rate-limiting MUST be enforced
-- at the server-side share access gateway (e.g. Supabase Edge Function).

DROP FUNCTION IF EXISTS public.resolve_story_share(TEXT, TEXT);
DROP FUNCTION IF EXISTS public.resolve_story_share(TEXT);

CREATE OR REPLACE FUNCTION public.resolve_story_share(
    p_share_token TEXT
)
RETURNS TABLE (
    share_id UUID,
    story_id UUID,
    access_level public.share_access_level,
    is_password_protected BOOLEAN,
    allow_comments BOOLEAN,
    allow_download BOOLEAN,
    watermark_enabled BOOLEAN,
    custom_message TEXT,
    is_valid BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_share public.story_shares%ROWTYPE;
BEGIN
    -- Look up active, non-expired share by exact cryptographic token match
    SELECT * INTO v_share
    FROM public.story_shares
    WHERE share_token = p_share_token
      AND is_active = true
      AND (expires_at IS NULL OR expires_at > now());

    IF NOT FOUND THEN
        RETURN;
    END IF;

    -- Atomically increment access telemetry
    UPDATE public.story_shares
    SET view_count = view_count + 1,
        last_accessed_at = now()
    WHERE id = v_share.id;

    -- Return authorized share metadata without exposing password hash or internal secrets
    RETURN QUERY
    SELECT 
        v_share.id,
        v_share.story_id,
        v_share.access_level,
        v_share.is_password_protected,
        v_share.allow_comments,
        v_share.allow_download,
        v_share.watermark_enabled,
        v_share.custom_message,
        true;
END;
$$;

-- Grant execution of the token resolver to anon, authenticated, and service_role
REVOKE ALL ON FUNCTION public.resolve_story_share(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.resolve_story_share(TEXT) TO anon, authenticated, service_role;

-- ==============================================================================
-- 5. EXPLICIT SCHEMA AND TABLE PRIVILEGES (MINIMAL PRIVILEGE ACCESS)
-- ==============================================================================

-- Ensure schema usage is available to client roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Authenticated and service roles receive standard DML access (governed strictly by RLS)
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated, service_role;

-- Anon role has zero table access; anonymous interactions must use dedicated RPCs
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;

