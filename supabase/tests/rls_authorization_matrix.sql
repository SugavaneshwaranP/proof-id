-- ============================================================================
-- BACKED / PROOF-ID — RLS AUTHORIZATION REGRESSION TEST MATRIX (RULE 15)
-- Evaluates Allowed-Path & Denied-Path: Anon vs Owner (User A) vs User B vs Admin
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- SETUP: Mock Users in auth.users
-- ----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgtap;

SELECT plan(12);

-- User A (Normal Owner)
INSERT INTO auth.users (id, email, raw_user_meta_data)
VALUES ('11111111-1111-1111-1111-111111111111', 'userA@test.com', '{"full_name":"Alice Architect"}')
ON CONFLICT (id) DO NOTHING;

-- User B (Attacker / Different User)
INSERT INTO auth.users (id, email, raw_user_meta_data)
VALUES ('22222222-2222-2222-2222-222222222222', 'userB@test.com', '{"full_name":"Bob Builder"}')
ON CONFLICT (id) DO NOTHING;

-- Admin User
INSERT INTO auth.users (id, email, raw_app_meta_data)
VALUES ('33333333-3333-3333-3333-333333333333', 'admin@backed.network', '{"role":"admin"}')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- TEST 1: User A inserts their own profile and project
-- ----------------------------------------------------------------------------
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claims" = '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';

INSERT INTO public.profiles (id, slug, profile_type, full_name, is_published)
VALUES ('11111111-1111-1111-1111-111111111111', 'alice-arch', 'person', 'Alice Architect', FALSE)
ON CONFLICT (id) DO UPDATE SET full_name = 'Alice Architect', is_published = FALSE;

INSERT INTO public.projects (id, profile_id, title)
VALUES ('aaaa1111-aaaa-1111-aaaa-111111111111', '11111111-1111-1111-1111-111111111111', 'Alice Project 1')
ON CONFLICT (id) DO NOTHING;

SELECT ok(
    EXISTS (SELECT 1 FROM public.projects WHERE id = 'aaaa1111-aaaa-1111-aaaa-111111111111'),
    'Test 1: User A can insert project on their own profile'
);

-- ----------------------------------------------------------------------------
-- TEST 2: Anonymous user CANNOT read User A unpublished profile
-- ----------------------------------------------------------------------------
SET LOCAL ROLE anon;
SET LOCAL "request.jwt.claims" = '{}';

SELECT ok(
    NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = '11111111-1111-1111-1111-111111111111'),
    'Test 2: Anon CANNOT read unpublished profile'
);

-- ----------------------------------------------------------------------------
-- TEST 3: User B CANNOT read User A unpublished profile
-- ----------------------------------------------------------------------------
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claims" = '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}';

SELECT ok(
    NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = '11111111-1111-1111-1111-111111111111'),
    'Test 3: User B CANNOT read User A unpublished profile'
);

-- ----------------------------------------------------------------------------
-- TEST 4: User B CANNOT update or delete User A project (IDOR Protection)
-- ----------------------------------------------------------------------------
UPDATE public.projects 
SET title = 'Hijacked Title' 
WHERE id = 'aaaa1111-aaaa-1111-aaaa-111111111111';

SELECT is(
    (SELECT title FROM public.projects WHERE id = 'aaaa1111-aaaa-1111-aaaa-111111111111'),
    NULL, -- Returns NULL because RLS prevents User B from seeing or mutating the row
    'Test 4: User B CANNOT mutate User A project via IDOR'
);

-- ----------------------------------------------------------------------------
-- TEST 5: Direct update of is_published by owner is BLOCKED (requires publish_profile RPC)
-- ----------------------------------------------------------------------------
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claims" = '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';

SELECT throws_ok(
    $$ UPDATE public.profiles SET is_published = TRUE WHERE id = '11111111-1111-1111-1111-111111111111' $$,
    'Direct client manipulation of is_published is prohibited. Use publish_profile RPC.',
    'Test 5: Direct modification of is_published blocked by trigger'
);

-- ----------------------------------------------------------------------------
-- TEST 6: Publish profile RPC fails if minimum requirements (capabilities) missing
-- ----------------------------------------------------------------------------
SELECT throws_ok(
    $$ SELECT public.publish_profile('11111111-1111-1111-1111-111111111111'::uuid) $$,
    'Minimum Credible Publishing Failure: At least 1 capability must be attached before publishing.',
    'Test 6: publish_profile RPC enforces minimum capability requirement'
);

-- ----------------------------------------------------------------------------
-- TEST 7: User A attaches capability and publishes profile successfully
-- ----------------------------------------------------------------------------
INSERT INTO public.capabilities (id, name, category)
VALUES ('cccc1111-cccc-1111-cccc-111111111111', 'Distributed Systems', 'Engineering')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profile_capabilities (profile_id, capability_id)
VALUES ('11111111-1111-1111-1111-111111111111', 'cccc1111-cccc-1111-cccc-111111111111')
ON CONFLICT DO NOTHING;

SELECT lives_ok(
    $$ SELECT public.publish_profile('11111111-1111-1111-1111-111111111111'::uuid) $$,
    'Test 7: publish_profile RPC succeeds once requirements are satisfied'
);

-- ----------------------------------------------------------------------------
-- TEST 8: Anon can now read published profile via public view
-- ----------------------------------------------------------------------------
SET LOCAL ROLE anon;
SET LOCAL "request.jwt.claims" = '{}';

SELECT ok(
    EXISTS (SELECT 1 FROM public.public_profiles_view WHERE id = '11111111-1111-1111-1111-111111111111'),
    'Test 8: Anon can read published profile via public view'
);

-- ----------------------------------------------------------------------------
-- TEST 9: Direct verification status spoofing is BLOCKED
-- ----------------------------------------------------------------------------
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claims" = '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';

INSERT INTO public.evidence_items (id, profile_id, title, status)
VALUES ('eeee1111-eeee-1111-eeee-111111111111', '11111111-1111-1111-1111-111111111111', 'Alice Evidence', 'unverified')
ON CONFLICT DO NOTHING;

SELECT throws_ok(
    $$ UPDATE public.evidence_items SET status = 'verified' WHERE id = 'eeee1111-eeee-1111-eeee-111111111111' $$,
    'Evidence status cannot be self-verified. Requires confirm_verification token resolution.',
    'Test 9: Evidence self-verification update blocked by trigger'
);

-- ----------------------------------------------------------------------------
-- TEST 10: User B CANNOT read User A private contact requests
-- ----------------------------------------------------------------------------
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claims" = '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';

INSERT INTO public.contact_requests (id, profile_id, sender_name, sender_email, message_body)
VALUES ('mmmm1111-mmmm-1111-mmmm-111111111111', '11111111-1111-1111-1111-111111111111', 'Recruiter', 'recruiter@hr.com', 'Confidential offer')
ON CONFLICT DO NOTHING;

-- Switch to User B
SET LOCAL "request.jwt.claims" = '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}';

SELECT ok(
    NOT EXISTS (SELECT 1 FROM public.contact_requests WHERE id = 'mmmm1111-mmmm-1111-mmmm-111111111111'),
    'Test 10: User B CANNOT view User A contact requests (Private Inbox)'
);

-- ----------------------------------------------------------------------------
-- TEST 11: Non-admin CANNOT view audit_events
-- ----------------------------------------------------------------------------
SELECT ok(
    NOT EXISTS (SELECT 1 FROM public.audit_events),
    'Test 11: Authenticated non-admin CANNOT view audit_events'
);

-- ----------------------------------------------------------------------------
-- TEST 12: Admin CAN view audit_events
-- ----------------------------------------------------------------------------
SET LOCAL "request.jwt.claims" = '{"sub":"33333333-3333-3333-3333-333333333333","role":"admin"}';

SELECT lives_ok(
    $$ SELECT COUNT(*) FROM public.audit_events $$,
    'Test 12: Admin CAN query audit_events table'
);

ROLLBACK;
