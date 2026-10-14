-- ============================================================================
-- BACKED / PROOF-ID — MIGRATION 20261014010000
-- Part 7: Single-Roundtrip Composite Public Profile RPC & B2B Quote Responses
-- ============================================================================

-- 1. Create B2B Quote Responses Table
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

-- 2. Fast Composite RPC for Public Profiles (Person + Business)
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
