-- ============================================================================
-- BACKED — DATABASE SCHEMA & RLS MIGRATION
-- Single Source of Truth Postgres Schema with Row Level Security (RLS)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. PROFILES TABLE
-- ----------------------------------------------------------------------------
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

-- Profiles RLS: Public profiles read by anyone; write only by owner
CREATE POLICY "Public profiles are readable by everyone" ON public.profiles
    FOR SELECT USING (is_published = true OR auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- ----------------------------------------------------------------------------
-- 2. BUSINESS DETAILS TABLE
-- ----------------------------------------------------------------------------
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

CREATE POLICY "Public business details are readable by everyone" ON public.business_details
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = profile_id AND is_published = true)
        OR auth.uid() = profile_id
    );

CREATE POLICY "Users can manage their business details" ON public.business_details
    FOR ALL USING (auth.uid() = profile_id);

-- ----------------------------------------------------------------------------
-- 3. CAPABILITIES & PROFILE CAPABILITIES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.capabilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.capabilities ENABLE ROW LEVEL SECURITY;
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

CREATE POLICY "Profile capabilities readable by everyone" ON public.profile_capabilities
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = profile_id AND is_published = true)
        OR auth.uid() = profile_id
    );

CREATE POLICY "Users can manage their profile capabilities" ON public.profile_capabilities
    FOR ALL USING (auth.uid() = profile_id);

-- ----------------------------------------------------------------------------
-- 4. PROJECTS & PRODUCTS TABLES
-- ----------------------------------------------------------------------------
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

CREATE POLICY "Projects readable by everyone" ON public.projects
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = profile_id AND is_published = true)
        OR auth.uid() = profile_id
    );

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

CREATE POLICY "Products readable by everyone" ON public.products
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = profile_id AND is_published = true)
        OR auth.uid() = profile_id
    );

CREATE POLICY "Users can manage their own products" ON public.products
    FOR ALL USING (auth.uid() = profile_id);

-- ----------------------------------------------------------------------------
-- 5. EVIDENCE ITEMS TABLE
-- ----------------------------------------------------------------------------
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

CREATE POLICY "Evidence items readable by everyone" ON public.evidence_items
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = profile_id AND is_published = true)
        OR auth.uid() = profile_id
    );

CREATE POLICY "Users can manage their own evidence" ON public.evidence_items
    FOR ALL USING (auth.uid() = profile_id);

-- ----------------------------------------------------------------------------
-- 6. VERIFICATION REQUESTS & EVENTS
-- ----------------------------------------------------------------------------
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

CREATE POLICY "Users view their verification requests" ON public.verification_requests
    FOR SELECT USING (auth.uid() = profile_id);

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

CREATE POLICY "Users read verification events" ON public.verification_events
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = profile_id AND is_published = true)
        OR auth.uid() = profile_id
    );

-- ----------------------------------------------------------------------------
-- 7. CONTACT REQUESTS (MESSAGES)
-- ----------------------------------------------------------------------------
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

-- Anyone can submit a quote request to a published profile
CREATE POLICY "Public visitors can insert quote requests" ON public.contact_requests
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = profile_id AND is_published = true)
    );

-- Only profile owner can read their inbox messages
CREATE POLICY "Owners can view their own contact requests" ON public.contact_requests
    FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "Owners can update read status" ON public.contact_requests
    FOR UPDATE USING (auth.uid() = profile_id);

-- ----------------------------------------------------------------------------
-- 8. REPORTS TABLE
-- ----------------------------------------------------------------------------
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

CREATE POLICY "Public visitors can file a report" ON public.reports
    FOR INSERT WITH CHECK (true);

-- Only users with admin role can view & manage reports
CREATE POLICY "Admins can view and manage reports" ON public.reports
    FOR ALL USING (
        COALESCE(current_setting('request.jwt.claims', true)::json->>'role', '') = 'admin'
    );

-- ----------------------------------------------------------------------------
-- 9. USER SETTINGS & DAILY ANALYTICS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profile_settings (
    profile_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    notify_new_messages BOOLEAN DEFAULT TRUE,
    notify_verifications BOOLEAN DEFAULT TRUE,
    notify_weekly_digest BOOLEAN DEFAULT TRUE,
    visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'unlisted', 'private')),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profile_settings ENABLE ROW LEVEL SECURITY;
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
CREATE POLICY "Owners view their daily analytics" ON public.daily_analytics FOR SELECT USING (auth.uid() = profile_id);

-- ============================================================================
-- RPC POSTGRES FUNCTIONS (DETERMINISTIC & SECURE)
-- ============================================================================

-- Function 1: Check Slug Availability
CREATE OR REPLACE FUNCTION public.check_slug_availability(target_slug TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN NOT EXISTS (
        SELECT 1 FROM public.profiles WHERE LOWER(slug) = LOWER(target_slug)
    );
END;
$$;

-- Function 2: Confirm Verification Claim via Token Hash
CREATE OR REPLACE FUNCTION public.confirm_verification(
    p_token TEXT,
    p_decision TEXT,
    p_note TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_hash TEXT;
    v_req RECORD;
    v_status TEXT;
BEGIN
    v_hash := encode(digest(p_token, 'sha256'), 'hex');
    
    SELECT * INTO v_req FROM public.verification_requests
    WHERE token_hash = v_hash AND status = 'pending';
    
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

-- Function 3: Search Profiles & Capabilities
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
      AND (p_query IS NULL OR p.headline ILIKE '%' || p_query || '%' OR p.full_name ILIKE '%' || p_query || '%' OR p.business_name ILIKE '%' || p_query || '%')
      AND (p_location IS NULL OR p.location ILIKE '%' || p_location || '%')
      AND (p_availability IS NULL OR p.availability_status = p_availability)
    GROUP BY p.id, p.slug, p.profile_type, p.full_name, p.business_name, p.headline, p.location, p.avatar_url, p.availability_status
    ORDER BY verified_proof_count DESC, p.created_at DESC;
END;
$$;

-- Function 4: Analytics Aggregation Summary
CREATE OR REPLACE FUNCTION public.get_profile_analytics_summary(
    p_profile_id UUID,
    p_days INT DEFAULT 30
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_total_views INT;
    v_total_visitors INT;
    v_total_messages INT;
    v_total_shares INT;
BEGIN
    SELECT 
        COALESCE(SUM(page_views), 0),
        COALESCE(SUM(unique_visitors), 0),
        COALESCE(SUM(messages_received), 0),
        COALESCE(SUM(link_shares), 0)
    INTO v_total_views, v_total_visitors, v_total_messages, v_total_shares
    FROM public.daily_analytics
    WHERE profile_id = p_profile_id 
      AND log_date >= (CURRENT_DATE - p_days);

    RETURN json_build_object(
        'page_views', v_total_views,
        'unique_visitors', v_total_visitors,
        'messages_received', v_total_messages,
        'link_shares', v_total_shares
    );
END;
$$;

-- ----------------------------------------------------------------------------
-- 10. DATABASE TRIGGER: CREATE DEFAULT PROFILE ON AUTH SIGNUP
-- ----------------------------------------------------------------------------
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
