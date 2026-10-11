-- ============================================================================
-- BACKED / PROOF-ID — P0 HARDENING MIGRATION (SLICE 3)
-- Strict Authorization, SECURITY DEFINER hardening, Atomic RPCs, Safe Views
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. HARDEN EXISTING SECURITY DEFINER FUNCTIONS WITH SAFE search_path
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.check_slug_availability(target_slug TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    IF target_slug IS NULL OR LENGTH(TRIM(target_slug)) < 3 THEN
        RETURN FALSE;
    END IF;
    RETURN NOT EXISTS (
        SELECT 1 FROM public.profiles WHERE LOWER(slug) = LOWER(TRIM(target_slug))
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.confirm_verification(
    p_token TEXT,
    p_decision TEXT,
    p_note TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_hash TEXT;
    v_req RECORD;
    v_status TEXT;
BEGIN
    IF p_token IS NULL OR LENGTH(p_token) < 8 THEN
        RETURN json_build_object('success', false, 'message', 'Invalid verification token format.');
    END IF;

    -- Tokens are SHA-256 hashed at rest
    v_hash := encode(digest(p_token, 'sha256'), 'hex');
    
    -- Atomic single-use lock
    SELECT * INTO v_req FROM public.verification_requests
    WHERE token_hash = v_hash AND status = 'pending'
    FOR UPDATE;
    
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'message', 'Token invalid, expired, or already used.');
    END IF;
    
    IF p_decision = 'accurate' THEN
        v_status := 'confirmed';
        UPDATE public.evidence_items 
        SET status = 'verified', updated_at = NOW() 
        WHERE id = v_req.evidence_id;
    ELSE
        v_status := 'declined';
        UPDATE public.evidence_items 
        SET status = 'declined', updated_at = NOW() 
        WHERE id = v_req.evidence_id;
    END IF;
    
    UPDATE public.verification_requests
    SET status = v_status, note = p_note, resolved_at = NOW()
    WHERE id = v_req.id;
    
    INSERT INTO public.verification_events (verification_request_id, evidence_id, profile_id, action, verifier_note)
    VALUES (v_req.id, v_req.evidence_id, v_req.profile_id, v_status, p_note);
    
    RETURN json_build_object('success', true, 'status', v_status, 'profile_id', v_req.profile_id);
END;
$$;

CREATE OR REPLACE FUNCTION public.search_profiles(
    p_query TEXT DEFAULT NULL,
    p_category TEXT DEFAULT NULL,
    p_location TEXT DEFAULT NULL,
    p_availability TEXT DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    slug TEXT,
    profile_type TEXT,
    full_name TEXT,
    business_name TEXT,
    headline TEXT,
    location TEXT,
    avatar_url TEXT,
    availability_status TEXT,
    verified_proof_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.slug,
        p.profile_type,
        p.full_name,
        p.business_name,
        p.headline,
        p.location,
        p.avatar_url,
        p.availability_status,
        COUNT(e.id) FILTER (WHERE e.status = 'verified') AS verified_proof_count
    FROM public.profiles p
    LEFT JOIN public.evidence_items e ON p.id = e.profile_id
    WHERE p.is_published = true
      AND (p_query IS NULL OR (
            p.headline ILIKE '%' || SUBSTRING(p_query, 1, 100) || '%' 
            OR p.full_name ILIKE '%' || SUBSTRING(p_query, 1, 100) || '%' 
            OR p.business_name ILIKE '%' || SUBSTRING(p_query, 1, 100) || '%'
          ))
      AND (p_location IS NULL OR p.location ILIKE '%' || SUBSTRING(p_location, 1, 100) || '%')
      AND (p_availability IS NULL OR p.availability_status = p_availability)
    GROUP BY p.id, p.slug, p.profile_type, p.full_name, p.business_name, p.headline, p.location, p.avatar_url, p.availability_status
    ORDER BY verified_proof_count DESC, p.created_at DESC
    LIMIT 50;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_profile_analytics_summary(
    p_profile_id UUID,
    p_days INT DEFAULT 30
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_caller UUID;
    v_is_admin BOOLEAN;
    v_total_views INT;
    v_total_visitors INT;
    v_total_messages INT;
    v_total_shares INT;
BEGIN
    v_caller := auth.uid();
    v_is_admin := (COALESCE(current_setting('request.jwt.claims', true)::json->>'role', '') = 'admin');

    -- Authorization check: Only profile owner or admin can access analytics
    IF v_caller IS NULL OR (v_caller != p_profile_id AND NOT v_is_admin) THEN
        RAISE EXCEPTION 'Access denied: Analytics are restricted to profile owner or system administrator.';
    END IF;

    SELECT 
        COALESCE(SUM(page_views), 0),
        COALESCE(SUM(unique_visitors), 0),
        COALESCE(SUM(messages_received), 0),
        COALESCE(SUM(link_shares), 0)
    INTO v_total_views, v_total_visitors, v_total_messages, v_total_shares
    FROM public.daily_analytics
    WHERE profile_id = p_profile_id 
      AND log_date >= (CURRENT_DATE - LEAST(p_days, 365));

    RETURN json_build_object(
        'page_views', v_total_views,
        'unique_visitors', v_total_visitors,
        'messages_received', v_total_messages,
        'link_shares', v_total_shares
    );
END;
$$;

-- ----------------------------------------------------------------------------
-- 2. DAILY ANALYTICS ATOMIC INCREMENT RPC
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.increment_daily_page_view(
    p_profile_id UUID,
    p_date DATE DEFAULT CURRENT_DATE
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    -- Verify profile is published before incrementing
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_profile_id AND is_published = TRUE) THEN
        RETURN;
    END IF;

    INSERT INTO public.daily_analytics (profile_id, log_date, page_views, unique_visitors)
    VALUES (p_profile_id, p_date, 1, 1)
    ON CONFLICT (profile_id, log_date)
    DO UPDATE SET page_views = public.daily_analytics.page_views + 1;
END;
$$;

-- ----------------------------------------------------------------------------
-- 3. ATOMIC PROFILE PUBLICATION RPC (ENFORCING MINIMUM CREDIBLE REQUIREMENTS)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.publish_profile(p_profile_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_profile RECORD;
    v_cap_count INT;
    v_score INT := 0;
BEGIN
    -- Authorization: Caller must own this profile
    IF auth.uid() IS NULL OR auth.uid() != p_profile_id THEN
        RAISE EXCEPTION 'Unauthorized: You can only publish your own profile.';
    END IF;

    SELECT * INTO v_profile FROM public.profiles WHERE id = p_profile_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Profile not found.';
    END IF;

    -- Minimum Credible Requirement 1: Identity / Name
    IF (v_profile.full_name IS NULL OR LENGTH(TRIM(v_profile.full_name)) < 2) AND
       (v_profile.business_name IS NULL OR LENGTH(TRIM(v_profile.business_name)) < 2) THEN
        RAISE EXCEPTION 'Minimum Credible Publishing Failure: A valid full name or business name is required.';
    END IF;

    -- Minimum Credible Requirement 2: At least 1 Capability
    SELECT COUNT(*) INTO v_cap_count FROM public.profile_capabilities WHERE profile_id = p_profile_id;
    IF v_cap_count < 1 THEN
        RAISE EXCEPTION 'Minimum Credible Publishing Failure: At least 1 capability must be attached before publishing.';
    END IF;

    -- Calculate deterministic completion score
    v_score := 50; -- Base for identity + capability
    IF v_profile.headline IS NOT NULL AND LENGTH(TRIM(v_profile.headline)) > 5 THEN v_score := v_score + 15; END IF;
    IF v_profile.bio IS NOT NULL AND LENGTH(TRIM(v_profile.bio)) > 15 THEN v_score := v_score + 15; END IF;
    IF EXISTS (SELECT 1 FROM public.evidence_items WHERE profile_id = p_profile_id) THEN v_score := v_score + 20; END IF;

    -- Atomically activate publication
    UPDATE public.profiles
    SET is_published = TRUE,
        completion_score = v_score,
        published_at = COALESCE(published_at, NOW()),
        updated_at = NOW()
    WHERE id = p_profile_id;

    RETURN json_build_object(
        'success', true,
        'is_published', true,
        'completion_score', v_score
    );
END;
$$;

-- ----------------------------------------------------------------------------
-- 4. SERVER-OWNED FIELDS TAMPER PREVENTION TRIGGERS
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.prevent_profile_tampering()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Prevent direct update of is_published, completion_score, or id by non-privileged client
    IF current_user != 'postgres' AND session_user != 'postgres' AND
       COALESCE(current_setting('request.jwt.claims', true)::json->>'role', '') != 'service_role' THEN
        
        -- If is_published changed outside of trusted publish_profile RPC
        IF OLD.is_published IS DISTINCT FROM NEW.is_published AND pg_trigger_depth() <= 1 THEN
            RAISE EXCEPTION 'Direct client manipulation of is_published is prohibited. Use publish_profile RPC.';
        END IF;

        -- If completion_score changed outside of trusted RPC
        IF OLD.completion_score IS DISTINCT FROM NEW.completion_score AND pg_trigger_depth() <= 1 THEN
            RAISE EXCEPTION 'completion_score is calculated server-side and cannot be directly modified.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_profile_tampering ON public.profiles;
CREATE TRIGGER trg_prevent_profile_tampering
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.prevent_profile_tampering();

-- Prevent direct evidence verification tampering by client
CREATE OR REPLACE FUNCTION public.prevent_evidence_status_tampering()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF current_user != 'postgres' AND session_user != 'postgres' AND
       COALESCE(current_setting('request.jwt.claims', true)::json->>'role', '') != 'service_role' THEN
        
        -- Non-service role cannot change status to 'verified' directly
        IF OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'verified' AND pg_trigger_depth() <= 1 THEN
            RAISE EXCEPTION 'Evidence status cannot be self-verified. Requires confirm_verification token resolution.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_evidence_tampering ON public.evidence_items;
CREATE TRIGGER trg_prevent_evidence_tampering
    BEFORE UPDATE ON public.evidence_items
    FOR EACH ROW EXECUTE FUNCTION public.prevent_evidence_status_tampering();

-- ----------------------------------------------------------------------------
-- 5. SAFE PUBLIC VIEWS (ALLOW-LISTED COLUMNS ONLY)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.public_profiles_view AS
SELECT 
    id,
    slug,
    profile_type,
    full_name,
    business_name,
    headline,
    location,
    bio,
    avatar_url,
    banner_url,
    availability_status,
    completion_score,
    published_at,
    created_at
FROM public.profiles
WHERE is_published = TRUE;

GRANT SELECT ON public.public_profiles_view TO anon, authenticated;

CREATE OR REPLACE VIEW public.public_evidence_view AS
SELECT 
    e.id,
    e.profile_id,
    p.slug AS profile_slug,
    e.title,
    e.category,
    e.evidence_type,
    e.external_url,
    e.file_path,
    e.status,
    e.created_at
FROM public.evidence_items e
JOIN public.profiles p ON p.id = e.profile_id
WHERE p.is_published = TRUE;

GRANT SELECT ON public.public_evidence_view TO anon, authenticated;

-- ----------------------------------------------------------------------------
-- 6. PERMISSIONS & GRANTS DISCIPLINE
-- ----------------------------------------------------------------------------
GRANT EXECUTE ON FUNCTION public.check_slug_availability(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.confirm_verification(TEXT, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.search_profiles(TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_daily_page_view(UUID, DATE) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.publish_profile(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_profile_analytics_summary(UUID, INT) TO authenticated;
