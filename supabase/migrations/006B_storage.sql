-- ==============================================================================
-- REELLEGACY PRODUCTION DATABASE MIGRATION PACKAGE
-- Migration: 006B_storage.sql
-- Description: Supabase Storage bucket configurations and user namespace isolation policies
-- Target Backend: Supabase / PostgreSQL 15+
-- ==============================================================================

-- 1. STORAGE BUCKET CONFIGURATION (Supabase Storage)

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    (
        'reellegacy-media',
        'reellegacy-media',
        false,
        104857600, -- 100MB
        ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'video/mp4', 'video/webm', 'video/quicktime', 'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    ),
    (
        'reellegacy-audio',
        'reellegacy-audio',
        false,
        52428800,  -- 50MB
        ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/aac', 'audio/flac', 'audio/webm', 'audio/ogg']
    ),
    (
        'reellegacy-renders',
        'reellegacy-renders',
        false,
        2147483648, -- 2GB
        ARRAY['video/mp4', 'video/quicktime', 'video/webm', 'application/zip', 'application/x-zip-compressed', 'application/pdf']
    )
ON CONFLICT (id) DO UPDATE SET
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. STORAGE OBJECT ROW LEVEL SECURITY POLICIES
-- Scoped to authenticated users with user UUID path isolation: {bucket_id}/{user_id}/...

DO $$ BEGIN
    DROP POLICY IF EXISTS "Users can read own storage files" ON storage.objects;
    CREATE POLICY "Users can read own storage files"
        ON storage.objects FOR SELECT
        TO authenticated
        USING (
            bucket_id IN ('reellegacy-media', 'reellegacy-audio', 'reellegacy-renders')
            AND (storage.foldername(name))[1] = auth.uid()::text
        );

    DROP POLICY IF EXISTS "Users can upload own storage files" ON storage.objects;
    CREATE POLICY "Users can upload own storage files"
        ON storage.objects FOR INSERT
        TO authenticated
        WITH CHECK (
            bucket_id IN ('reellegacy-media', 'reellegacy-audio', 'reellegacy-renders')
            AND (storage.foldername(name))[1] = auth.uid()::text
        );

    DROP POLICY IF EXISTS "Users can update own storage files" ON storage.objects;
    CREATE POLICY "Users can update own storage files"
        ON storage.objects FOR UPDATE
        TO authenticated
        USING (
            bucket_id IN ('reellegacy-media', 'reellegacy-audio', 'reellegacy-renders')
            AND (storage.foldername(name))[1] = auth.uid()::text
        )
        WITH CHECK (
            bucket_id IN ('reellegacy-media', 'reellegacy-audio', 'reellegacy-renders')
            AND (storage.foldername(name))[1] = auth.uid()::text
        );

    DROP POLICY IF EXISTS "Users can delete own storage files" ON storage.objects;
    CREATE POLICY "Users can delete own storage files"
        ON storage.objects FOR DELETE
        TO authenticated
        USING (
            bucket_id IN ('reellegacy-media', 'reellegacy-audio', 'reellegacy-renders')
            AND (storage.foldername(name))[1] = auth.uid()::text
        );
EXCEPTION
    WHEN undefined_table THEN
        RAISE NOTICE 'storage.objects table not yet initialized. Apply storage policies in Supabase dashboard or after storage extension is enabled.';
END $$;
