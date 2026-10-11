-- ============================================================================
-- BACKED / PROOF-ID — STORAGE BUCKET & RLS POLICIES (RULE 12)
-- Configures private evidence-vault bucket and strict folder-level RLS.
-- ============================================================================

-- 1. Create private Storage Bucket for evidence assets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'evidence-vault',
    'evidence-vault',
    false, -- Private bucket: anonymous public access strictly disabled
    5242880, -- 5 MB max limit
    ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
    public = false,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];

-- 2. Storage Objects RLS: Owner Folder Isolation
-- Path format: user_<uuid>/<timestamp>_<uniqueId>_<filename>

DROP POLICY IF EXISTS "Users can only upload to their own user folder" ON storage.objects;
CREATE POLICY "Users can only upload to their own user folder" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'evidence-vault'
        AND (storage.foldername(name))[1] = 'user_' || auth.uid()::text
    );

DROP POLICY IF EXISTS "Users can read their own evidence files" ON storage.objects;
CREATE POLICY "Users can read their own evidence files" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'evidence-vault'
        AND (
            (storage.foldername(name))[1] = 'user_' || auth.uid()::text
            OR COALESCE(current_setting('request.jwt.claims', true)::json->>'role', '') = 'admin'
        )
    );

DROP POLICY IF EXISTS "Users can delete their own evidence files" ON storage.objects;
CREATE POLICY "Users can delete their own evidence files" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'evidence-vault'
        AND (
            (storage.foldername(name))[1] = 'user_' || auth.uid()::text
            OR COALESCE(current_setting('request.jwt.claims', true)::json->>'role', '') = 'admin'
        )
    );
