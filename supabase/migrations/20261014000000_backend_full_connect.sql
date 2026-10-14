-- ============================================================================
-- BACKED / PROOF-ID — BACKEND FULL CONNECTION MIGRATION
-- Adds get_claim_by_token, add_profile_capability RPC, capabilities insert policy,
-- and updates handle_new_user() trigger to respect user metadata slug.
-- ============================================================================

-- 1. Capabilities Insert Policy for Authenticated Users
DROP POLICY IF EXISTS "Authenticated users can insert capabilities" ON public.capabilities;
CREATE POLICY "Authenticated users can insert capabilities" ON public.capabilities
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 2. add_profile_capability RPC
CREATE OR REPLACE FUNCTION public.add_profile_capability(
    p_capability_name TEXT,
    p_category TEXT DEFAULT 'General'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_caller UUID;
    v_cap_id UUID;
    v_clean_name TEXT;
BEGIN
    v_caller := auth.uid();
    IF v_caller IS NULL THEN
        RAISE EXCEPTION 'Authentication required to attach profile capabilities.';
    END IF;

    v_clean_name := TRIM(p_capability_name);
    IF v_clean_name IS NULL OR LENGTH(v_clean_name) < 2 THEN
        RAISE EXCEPTION 'Capability name must be at least 2 characters.';
    END IF;

    -- Get or create capability in taxonomy
    SELECT id INTO v_cap_id FROM public.capabilities WHERE LOWER(name) = LOWER(v_clean_name);
    IF v_cap_id IS NULL THEN
        INSERT INTO public.capabilities (name, category)
        VALUES (v_clean_name, COALESCE(p_category, 'General'))
        RETURNING id INTO v_cap_id;
    END IF;

    -- Attach to caller's profile
    INSERT INTO public.profile_capabilities (profile_id, capability_id, display_order)
    VALUES (v_caller, v_cap_id, 0)
    ON CONFLICT (profile_id, capability_id) DO NOTHING;

    RETURN json_build_object(
        'success', true,
        'capability_id', v_cap_id,
        'name', v_clean_name,
        'category', COALESCE(p_category, 'General')
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.add_profile_capability(TEXT, TEXT) TO authenticated;

-- 3. get_claim_by_token RPC for verifiers
CREATE OR REPLACE FUNCTION public.get_claim_by_token(p_token TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_hash TEXT;
    v_req RECORD;
    v_ev RECORD;
    v_prof RECORD;
BEGIN
    IF p_token IS NULL OR LENGTH(TRIM(p_token)) < 6 THEN
        RETURN json_build_object('valid', false, 'message', 'Invalid verification token format.');
    END IF;

    v_hash := encode(digest(TRIM(p_token), 'sha256'), 'hex');

    SELECT * INTO v_req FROM public.verification_requests
    WHERE token_hash = v_hash;

    IF NOT FOUND THEN
        RETURN json_build_object('valid', false, 'message', 'Verification request not found or token has expired.');
    END IF;

    SELECT * INTO v_ev FROM public.evidence_items WHERE id = v_req.evidence_id;
    SELECT * INTO v_prof FROM public.profiles WHERE id = v_req.profile_id;

    RETURN json_build_object(
        'valid', true,
        'status', v_req.status,
        'verifier_name', v_req.verifier_name,
        'verifier_email', v_req.verifier_email,
        'claim_title', COALESCE(v_ev.title, 'Verified Artifact'),
        'claim_category', COALESCE(v_ev.category, 'General Proof'),
        'claim_url', v_ev.external_url,
        'requester_name', COALESCE(v_prof.full_name, v_prof.business_name, 'Profile Owner'),
        'requester_slug', v_prof.slug,
        'created_at', v_req.created_at
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_claim_by_token(TEXT) TO anon, authenticated;

-- 4. Update handle_new_user() to preserve user-provided slug and profile_type
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.profiles (id, slug, profile_type, full_name, is_published)
    VALUES (
        NEW.id,
        COALESCE(NULLIF(NEW.raw_user_meta_data->>'slug', ''), 'user-' || SUBSTRING(NEW.id::text, 1, 8)),
        COALESCE(NULLIF(NEW.raw_user_meta_data->>'profile_type', ''), 'person'),
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'New Member'),
        FALSE
    ) ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.profile_settings (profile_id)
    VALUES (NEW.id)
    ON CONFLICT (profile_id) DO NOTHING;

    RETURN NEW;
END;
$$;
