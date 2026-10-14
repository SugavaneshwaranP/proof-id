-- ============================================================================
-- BACKED / PROOF-ID — COMPLETE CONSOLIDATED MIGRATIONS (PARTS 1 TO 4)
-- Run this in the Supabase Dashboard SQL Editor:
-- https://supabase.com/dashboard/project/yvzfmfpzhanwlxstdmkk/sql/new
-- ============================================================================

-- ============================================================================
-- PART 1: BASE BACKEND ARCHITECTURE & TABLES
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    slug TEXT UNIQUE NOT NULL,
    profile_type TEXT NOT NULL CHECK (profile_type IN ('person', 'business')),
    full_name TEXT,
    business_name TEXT,
    headline TEXT,
    location TEXT,
    bio TEXT,
    avatar_url TEXT,
    banner_url TEXT,
    availability_status TEXT DEFAULT 'Open to work',
    is_published BOOLEAN DEFAULT FALSE,
    completion_score INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are readable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are readable by everyone" ON public.profiles
    FOR SELECT USING (is_published = true OR auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- 2. BUSINESS DETAILS TABLE
CREATE TABLE IF NOT EXISTS public.business_details (
    profile_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    regions_served TEXT[],
    payment_terms TEXT,
    sample_availability TEXT,
    facility_description TEXT,
    facility_photos TEXT[],
    certifications TEXT[],
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.business_details ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public business details are readable by everyone" ON public.business_details;
CREATE POLICY "Public business details are readable by everyone" ON public.business_details
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = profile_id AND is_published = true)
        OR auth.uid() = profile_id
    );

DROP POLICY IF EXISTS "Users can manage their business details" ON public.business_details;
CREATE POLICY "Users can manage their business details" ON public.business_details
    FOR ALL USING (auth.uid() = profile_id);

-- 3. CAPABILITIES & PROFILE CAPABILITIES
CREATE TABLE IF NOT EXISTS public.capabilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.capabilities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Capabilities taxonomy readable by all" ON public.capabilities;
CREATE POLICY "Capabilities taxonomy readable by all" ON public.capabilities FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS public.profile_capabilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    capability_id UUID NOT NULL REFERENCES public.capabilities(id) ON DELETE CASCADE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(profile_id, capability_id)
);

ALTER TABLE public.profile_capabilities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profile capabilities readable by everyone" ON public.profile_capabilities;
CREATE POLICY "Profile capabilities readable by everyone" ON public.profile_capabilities
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = profile_id AND is_published = true)
        OR auth.uid() = profile_id
    );

DROP POLICY IF EXISTS "Users can manage their profile capabilities" ON public.profile_capabilities;
CREATE POLICY "Users can manage their profile capabilities" ON public.profile_capabilities
    FOR ALL USING (auth.uid() = profile_id);

-- 4. PROJECTS & PRODUCTS TABLES
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    one_line_result TEXT,
    description TEXT,
    project_url TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Projects readable by everyone" ON public.projects;
CREATE POLICY "Projects readable by everyone" ON public.projects
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = profile_id AND is_published = true)
        OR auth.uid() = profile_id
    );

DROP POLICY IF EXISTS "Users can manage their own projects" ON public.projects;
CREATE POLICY "Users can manage their own projects" ON public.projects
    FOR ALL USING (auth.uid() = profile_id);

CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT,
    short_description TEXT,
    minimum_order TEXT,
    lead_time TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Products readable by everyone" ON public.products;
CREATE POLICY "Products readable by everyone" ON public.products
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = profile_id AND is_published = true)
        OR auth.uid() = profile_id
    );

DROP POLICY IF EXISTS "Users can manage their own products" ON public.products;
CREATE POLICY "Users can manage their own products" ON public.products
    FOR ALL USING (auth.uid() = profile_id);

-- 5. EVIDENCE ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.evidence_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT,
    evidence_type TEXT CHECK (evidence_type IN ('link', 'file', 'certificate', 'code_pr')),
    external_url TEXT,
    file_path TEXT,
    status TEXT DEFAULT 'unverified' CHECK (status IN ('unverified', 'pending', 'verified', 'declined')),
    file_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.evidence_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Evidence items readable by everyone" ON public.evidence_items;
CREATE POLICY "Evidence items readable by everyone" ON public.evidence_items
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = profile_id AND is_published = true)
        OR auth.uid() = profile_id
    );

DROP POLICY IF EXISTS "Users can manage their own evidence" ON public.evidence_items;
CREATE POLICY "Users can manage their own evidence" ON public.evidence_items
    FOR ALL USING (auth.uid() = profile_id);

-- 6. VERIFICATION REQUESTS & EVENTS
CREATE TABLE IF NOT EXISTS public.verification_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    evidence_id UUID NOT NULL REFERENCES public.evidence_items(id) ON DELETE CASCADE,
    verifier_name TEXT NOT NULL,
    verifier_email TEXT NOT NULL,
    token_hash TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'declined', 'expired')),
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view their verification requests" ON public.verification_requests;
CREATE POLICY "Users view their verification requests" ON public.verification_requests
    FOR SELECT USING (auth.uid() = profile_id);

DROP POLICY IF EXISTS "Users insert verification requests" ON public.verification_requests;
CREATE POLICY "Users insert verification requests" ON public.verification_requests
    FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE TABLE IF NOT EXISTS public.verification_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    verification_request_id UUID REFERENCES public.verification_requests(id) ON DELETE SET NULL,
    evidence_id UUID NOT NULL REFERENCES public.evidence_items(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    verifier_note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.verification_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read verification events" ON public.verification_events;
CREATE POLICY "Users read verification events" ON public.verification_events
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = profile_id AND is_published = true)
        OR auth.uid() = profile_id
    );

-- 7. CONTACT REQUESTS (MESSAGES)
CREATE TABLE IF NOT EXISTS public.contact_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    sender_name TEXT NOT NULL,
    sender_email TEXT NOT NULL,
    subject TEXT,
    message_body TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public visitors can insert quote requests" ON public.contact_requests;
CREATE POLICY "Public visitors can insert quote requests" ON public.contact_requests
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = profile_id AND is_published = true)
    );

DROP POLICY IF EXISTS "Owners can view their own contact requests" ON public.contact_requests;
CREATE POLICY "Owners can view their own contact requests" ON public.contact_requests
    FOR SELECT USING (auth.uid() = profile_id);

DROP POLICY IF EXISTS "Owners can update read status" ON public.contact_requests;
CREATE POLICY "Owners can update read status" ON public.contact_requests
    FOR UPDATE USING (auth.uid() = profile_id);

-- 8. REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    details TEXT,
    reporter_ip TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'dismissed', 'warned', 'taken_down')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public visitors can file a report" ON public.reports;
CREATE POLICY "Public visitors can file a report" ON public.reports
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view and manage reports" ON public.reports;
CREATE POLICY "Admins can view and manage reports" ON public.reports
    FOR ALL USING (
        COALESCE(current_setting('request.jwt.claims', true)::json->>'role', '') = 'admin'
    );

-- 9. USER SETTINGS & DAILY ANALYTICS
CREATE TABLE IF NOT EXISTS public.profile_settings (
    profile_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    notify_new_messages BOOLEAN DEFAULT TRUE,
    notify_verifications BOOLEAN DEFAULT TRUE,
    notify_weekly_digest BOOLEAN DEFAULT TRUE,
    visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'unlisted', 'private')),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profile_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage their own settings" ON public.profile_settings;
CREATE POLICY "Users manage their own settings" ON public.profile_settings FOR ALL USING (auth.uid() = profile_id);

CREATE TABLE IF NOT EXISTS public.daily_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    page_views INT DEFAULT 0,
    unique_visitors INT DEFAULT 0,
    messages_received INT DEFAULT 0,
    link_shares INT DEFAULT 0,
    UNIQUE(profile_id, log_date)
);

ALTER TABLE public.daily_analytics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Owners view their daily analytics" ON public.daily_analytics;
CREATE POLICY "Owners view their daily analytics" ON public.daily_analytics FOR SELECT USING (auth.uid() = profile_id);

-- 10. DATABASE TRIGGER: CREATE DEFAULT PROFILE ON AUTH SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.profiles (id, slug, profile_type, full_name, is_published)
    VALUES (
        NEW.id,
        'user-' || SUBSTRING(NEW.id::text, 1, 8),
        'person',
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'New Member'),
        FALSE
    ) ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.profile_settings (profile_id)
    VALUES (NEW.id)
    ON CONFLICT (profile_id) DO NOTHING;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- PART 2: SECURITY HARDENING & IMMUTABLE AUDIT LOGS
-- ============================================================================

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

DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_events;
CREATE POLICY "Admins can view audit logs" ON public.audit_events
    FOR SELECT USING (
        COALESCE(current_setting('request.jwt.claims', true)::json->>'role', '') = 'admin'
    );

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

-- ============================================================================
-- PART 3: P0 HARDENING, SECURITY DEFINER LOCKDOWN, RPCs & SAFE VIEWS
-- ============================================================================

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

    v_hash := encode(digest(p_token, 'sha256'), 'hex');
    
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
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_profile_id AND is_published = TRUE) THEN
        RETURN;
    END IF;

    INSERT INTO public.daily_analytics (profile_id, log_date, page_views, unique_visitors)
    VALUES (p_profile_id, p_date, 1, 1)
    ON CONFLICT (profile_id, log_date)
    DO UPDATE SET page_views = public.daily_analytics.page_views + 1;
END;
$$;

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
    IF auth.uid() IS NULL OR auth.uid() != p_profile_id THEN
        RAISE EXCEPTION 'Unauthorized: You can only publish your own profile.';
    END IF;

    SELECT * INTO v_profile FROM public.profiles WHERE id = p_profile_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Profile not found.';
    END IF;

    IF (v_profile.full_name IS NULL OR LENGTH(TRIM(v_profile.full_name)) < 2) AND
       (v_profile.business_name IS NULL OR LENGTH(TRIM(v_profile.business_name)) < 2) THEN
        RAISE EXCEPTION 'Minimum Credible Publishing Failure: A valid full name or business name is required.';
    END IF;

    SELECT COUNT(*) INTO v_cap_count FROM public.profile_capabilities WHERE profile_id = p_profile_id;
    IF v_cap_count < 1 THEN
        RAISE EXCEPTION 'Minimum Credible Publishing Failure: At least 1 capability must be attached before publishing.';
    END IF;

    v_score := 50;
    IF v_profile.headline IS NOT NULL AND LENGTH(TRIM(v_profile.headline)) > 5 THEN v_score := v_score + 15; END IF;
    IF v_profile.bio IS NOT NULL AND LENGTH(TRIM(v_profile.bio)) > 15 THEN v_score := v_score + 15; END IF;
    IF EXISTS (SELECT 1 FROM public.evidence_items WHERE profile_id = p_profile_id) THEN v_score := v_score + 20; END IF;

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

CREATE OR REPLACE FUNCTION public.prevent_profile_tampering()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF current_user != 'postgres' AND session_user != 'postgres' AND
       COALESCE(current_setting('request.jwt.claims', true)::json->>'role', '') != 'service_role' THEN
        
        IF OLD.is_published IS DISTINCT FROM NEW.is_published AND pg_trigger_depth() <= 1 THEN
            RAISE EXCEPTION 'Direct client manipulation of is_published is prohibited. Use publish_profile RPC.';
        END IF;

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

CREATE OR REPLACE FUNCTION public.prevent_evidence_status_tampering()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF current_user != 'postgres' AND session_user != 'postgres' AND
       COALESCE(current_setting('request.jwt.claims', true)::json->>'role', '') != 'service_role' THEN
        
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

GRANT EXECUTE ON FUNCTION public.check_slug_availability(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.confirm_verification(TEXT, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.search_profiles(TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_daily_page_view(UUID, DATE) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.publish_profile(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_profile_analytics_summary(UUID, INT) TO authenticated;

-- ============================================================================
-- PART 4: PRIVATE EVIDENCE STORAGE BUCKET & FOLDER RLS
-- ============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'evidence-vault',
    'evidence-vault',
    false,
    5242880,
    ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
    public = false,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];

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

-- ============================================================================
-- PART 5: AUTOMATED DAILY ANALYTICS CRON SCHEDULE (pg_cron + pg_net)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'daily-analytics-rollup') THEN
        PERFORM cron.unschedule('daily-analytics-rollup');
    END IF;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

SELECT cron.schedule(
    'daily-analytics-rollup',
    '5 0 * * *',
    $$
    SELECT net.http_post(
        url := 'https://yvzfmfpzhanwlxstdmkk.supabase.co/functions/v1/aggregate-analytics',
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'x-cron-secret', 'c8f7e2a9b4d160e3a5f82c7d9e1b4a6f'
        ),
        body := '{}'::jsonb
    );
    $$
);

-- ============================================================================
-- PART 6: CLAIM VERIFIER RPC, CAPABILITY RPC & METADATA PRESERVATION
-- ============================================================================

DROP POLICY IF EXISTS "Authenticated users can insert capabilities" ON public.capabilities;
CREATE POLICY "Authenticated users can insert capabilities" ON public.capabilities
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

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

    SELECT id INTO v_cap_id FROM public.capabilities WHERE LOWER(name) = LOWER(v_clean_name);
    IF v_cap_id IS NULL THEN
        INSERT INTO public.capabilities (name, category)
        VALUES (v_clean_name, COALESCE(p_category, 'General'))
        RETURNING id INTO v_cap_id;
    END IF;

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

-- ============================================================================
-- PART 7: COMPOSITE BUNDLE RPC & B2B QUOTE RESPONSES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.quote_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_request_id UUID NOT NULL REFERENCES public.contact_requests(id) ON DELETE CASCADE,
    supplier_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    unit_price NUMERIC(12, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    moq INT NOT NULL DEFAULT 1,
    lead_time_days INT NOT NULL DEFAULT 7,
    payment_terms TEXT NOT NULL DEFAULT 'Net 30',
    valid_until DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '30 days'),
    quote_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.quote_responses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Suppliers manage their own quote responses" ON public.quote_responses;
CREATE POLICY "Suppliers manage their own quote responses"
    ON public.quote_responses FOR ALL
    USING (auth.uid() = supplier_profile_id);

DROP POLICY IF EXISTS "Buyers can view quote responses" ON public.quote_responses;
CREATE POLICY "Buyers can view quote responses"
    ON public.quote_responses FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.contact_requests cr
            WHERE cr.id = contact_request_id
        )
    );

CREATE OR REPLACE FUNCTION public.get_public_profile_bundle(p_slug TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_profile RECORD;
    v_business RECORD;
    v_capabilities JSONB;
    v_evidence JSONB;
    v_projects JSONB;
    v_products JSONB;
    v_result JSONB;
BEGIN
    SELECT * INTO v_profile
    FROM public.profiles
    WHERE slug = LOWER(TRIM(p_slug))
      AND is_published = TRUE;

    IF v_profile.id IS NULL THEN
        RETURN NULL;
    END IF;

    -- Increment daily analytics view counter
    INSERT INTO public.daily_analytics (profile_id, log_date, page_views, unique_visitors)
    VALUES (v_profile.id, CURRENT_DATE, 1, 1)
    ON CONFLICT (profile_id, log_date)
    DO UPDATE SET page_views = public.daily_analytics.page_views + 1;

    -- Capabilities
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', c.id,
        'name', c.name,
        'category', c.category,
        'display_order', pc.display_order
    ) ORDER BY pc.display_order ASC), '[]'::jsonb)
    INTO v_capabilities
    FROM public.profile_capabilities pc
    JOIN public.capabilities c ON pc.capability_id = c.id
    WHERE pc.profile_id = v_profile.id;

    -- Verified Evidence
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', e.id,
        'title', e.title,
        'category', e.category,
        'evidence_type', e.evidence_type,
        'external_url', e.external_url,
        'status', e.status,
        'created_at', e.created_at
    ) ORDER BY e.created_at DESC), '[]'::jsonb)
    INTO v_evidence
    FROM public.evidence_items e
    WHERE e.profile_id = v_profile.id;

    -- Projects
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', p.id,
        'title', p.title,
        'description', p.description,
        'one_line_result', p.one_line_result,
        'project_url', p.project_url,
        'created_at', p.created_at
    ) ORDER BY p.created_at DESC), '[]'::jsonb)
    INTO v_projects
    FROM public.projects p
    WHERE p.profile_id = v_profile.id;

    -- Products
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', pr.id,
        'name', pr.name,
        'category', pr.category,
        'short_description', pr.short_description,
        'minimum_order', pr.minimum_order,
        'lead_time', pr.lead_time,
        'image_url', pr.image_url,
        'created_at', pr.created_at
    ) ORDER BY pr.created_at DESC), '[]'::jsonb)
    INTO v_products
    FROM public.products pr
    WHERE pr.profile_id = v_profile.id;

    -- Business details extension
    SELECT * INTO v_business
    FROM public.business_details
    WHERE profile_id = v_profile.id;

    v_result := jsonb_build_object(
        'profile', jsonb_build_object(
            'id', v_profile.id,
            'slug', v_profile.slug,
            'profile_type', v_profile.profile_type,
            'full_name', v_profile.full_name,
            'business_name', v_profile.business_name,
            'headline', v_profile.headline,
            'location', v_profile.location,
            'bio', v_profile.bio,
            'avatar_url', v_profile.avatar_url,
            'availability_status', v_profile.availability_status,
            'completion_score', v_profile.completion_score,
            'published_at', v_profile.published_at
        ),
        'business_details', CASE WHEN v_business.profile_id IS NOT NULL THEN jsonb_build_object(
            'regions_served', v_business.regions_served,
            'payment_terms', v_business.payment_terms,
            'sample_availability', v_business.sample_availability,
            'facility_description', v_business.facility_description,
            'certifications', v_business.certifications
        ) ELSE NULL END,
        'capabilities', v_capabilities,
        'evidence', v_evidence,
        'projects', v_projects,
        'products', v_products
    );

    RETURN v_result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_profile_bundle(TEXT) TO anon, authenticated;



