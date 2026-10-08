-- ============================================================================
-- BACKED — SECURITY HARDENING MIGRATION
-- Immutable Audit Logging, Application-Level Envelope Encryption & RLS Guards
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. IMMUTABLE AUDIT LOGGING TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID,
    ip_address TEXT,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

-- Security Rule: Audit events can ONLY be inserted via database triggers or Service Role.
-- NO client role (anon or authenticated) can INSERT, UPDATE, or DELETE audit records.
CREATE POLICY "Admins can view audit logs" ON public.audit_events
    FOR SELECT USING (
        COALESCE(current_setting('request.jwt.claims', true)::json->>'role', '') = 'admin'
    );

-- Prevent any UPDATE or DELETE on audit logs to ensure immutability
CREATE OR REPLACE FUNCTION public.prevent_audit_log_tampering()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    RAISE EXCEPTION 'Audit log records are immutable and cannot be updated or deleted.';
END;
$$;

DROP TRIGGER IF EXISTS enforce_audit_immutability ON public.audit_events;
CREATE TRIGGER enforce_audit_immutability
    BEFORE UPDATE OR DELETE ON public.audit_events
    FOR EACH ROW EXECUTE FUNCTION public.prevent_audit_log_tampering();

-- ----------------------------------------------------------------------------
-- 2. AUTOMATIC AUDIT TRIGGER ON SENSITIVE TABLES
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.log_profile_moderation_audit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF (OLD.is_published = TRUE AND NEW.is_published = FALSE) THEN
        INSERT INTO public.audit_events (actor_id, action, resource_type, resource_id, metadata)
        VALUES (
            auth.uid(),
            'PROFILE_TAKEDOWN',
            'profiles',
            NEW.id,
            jsonb_build_object('reason', 'Admin or automated moderation takedown')
        );
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS audit_profile_moderation ON public.profiles;
CREATE TRIGGER audit_profile_moderation
    AFTER UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.log_profile_moderation_audit();

-- ----------------------------------------------------------------------------
-- 3. APPLICATION-LEVEL AEAD ENCRYPTION HELPERS (pgcrypto)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.encrypt_sensitive_field(p_plain_text TEXT, p_passphrase TEXT)
RETURNS BYTEA
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN pgp_sym_encrypt(p_plain_text, p_passphrase, 'cipher-algo=aes256');
END;
$$;

CREATE OR REPLACE FUNCTION public.decrypt_sensitive_field(p_cipher_text BYTEA, p_passphrase TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN pgp_sym_decrypt(p_cipher_text, p_passphrase);
END;
$$;
