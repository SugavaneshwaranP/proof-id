# Screen-by-Screen Data Flow & Architecture Specification

> **Document Path**: `docs/SCREEN_BY_SCREEN_FLOW.md`  
> **Brand Name**: Backed (Proof-Backed Identity Network)  
> **Purpose**: Complete annotated specification for every screen across all 5 user workflow parts: client-side storage, Supabase API calls, Real-time channels, and Edge Functions.

---

## 📋 Executive Architecture Overview

| Layer | Implementation Standard |
| :--- | :--- |
| **Client-side Storage** | Browser `LocalStorage` for user preferences & non-sensitive drafts; `SessionStorage` for transient multi-step onboarding states; HTTP-Only `Cookies` for JWT session tokens & anonymous visitor tracking IDs (`anon_visitor_id`). |
| **Supabase Data Calls** | Native Supabase JS Client using PostgreSQL Row Level Security (RLS) policies (`auth.uid() = profile_id`), RPC functions for search/slug validation, and direct storage operations. |
| **Real-time Engine** | Supabase Realtime Channels (`postgres_changes`) over WebSocket for instant inbox updates, live verification status badges, and admin report monitoring. |
| **Edge Compute** | Cloudflare Workers & Supabase Edge Functions for fast serverless SSR HTML rendering, OpenGraph image generation, image compression, verification token mailers, and rate-limiting. |

---

## Part One — First Impressions

| Page | Route | Client-side Storage | Supabase Call | Real-time | Edge Function |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Landing** | `/` | `LocalStorage` (theme: `light`/`dark`), `Cookies` (`anon_visitor_id` UUID) | None — fully static page, edge-cached | No | None — Edge-cached on Cloudflare CDN |
| **Log In** | `/login` | `Cookies` (`sb-access-token`, `sb-refresh-token` set on auth success) | `auth.signInWithPassword({ email, password })` or `auth.signInWithOAuth({ provider: 'google' })` | No | None — Handled directly by Supabase Auth service |
| **Sign Up** | `/signup` | `Cookies` (session tokens), `LocalStorage` (`referral_tag` merged on first profile save) | `auth.signUp({ email, password })` $\rightarrow$ DB Trigger `on_auth_user_created` inserts default `profiles` row | No | None — DB trigger provisions user record automatically |

### Part One Annotations
- **Landing (`/`)**: High-performance static landing page designed with zero network latency. Uses `anon_visitor_id` cookie for anonymous analytics tracking upon scroll.
- **Log In (`/login`)**: Direct authentication flow against Supabase Auth. Sets secure HTTP-Only session cookies for state persistence across browser reloads.
- **Sign Up (`/signup`)**: Leverages PostgreSQL database triggers (`AFTER INSERT ON auth.users`) to seamlessly create an empty profile dossier row, preventing orphan accounts.

---

## Part Two — Getting Set Up (Onboarding Flow)

| Page | Route | Client-side Storage | Supabase Call | Real-time | Edge Function |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Profile Type** | `/onboarding/type` | `SessionStorage` (`draft_account_type`: `'person'` \| `'business'`) | None — buffered local browser state | No | None |
| **Claim Link** | `/onboarding/slug` | `LocalStorage` (`draft_slug`) | `rpc('check_slug_availability', { target_slug })` | No | None |
| **Basic Info (Person)** | `/onboarding/basics` | `LocalStorage` (`draft_profile_details`: name, headline, location, bio) | `supabase.from('profiles').update({ full_name, headline, location, avatar_url }).eq('id', userId)` | No | `image-optimizer` Edge Function (resizes & compresses uploaded avatars) |
| **Basic Info (Business)**| `/onboarding/basics-business` | `LocalStorage` (`draft_business_details`: company name, regions, terms) | `supabase.from('profiles').update({ business_name, regions_served, payment_terms }).eq('id', userId)` | No | `image-optimizer` Edge Function (resizes company logo & banner images) |
| **Capabilities** | `/onboarding/capabilities` | `LocalStorage` (`draft_capabilities`: 3–8 skill/service tags) | `supabase.from('profile_capabilities').upsert([{ profile_id, capability_id, display_order }])` | No | None |
| **Add Proof** | `/onboarding/proof` | `SessionStorage` (`draft_evidence_item`: title, url, binary file) | `supabase.storage.from('evidence-vault').upload(...)` + `supabase.from('evidence_items').insert(...)` | No | `evidence-verifier` Edge Function (scans uploaded files & generates cryptographic hash) |
| **Preview** | `/onboarding/preview` | `SessionStorage` (`draft_preview_snapshot`) | `supabase.from('profiles').select('*, profile_capabilities(*), evidence_items(*)').eq('id', userId)` | No | `ssr-preview-renderer` Edge Function (renders card snapshot preview) |
| **Published** | `/onboarding/published` | `LocalStorage` (`published_slug`, clears onboarding draft keys) | `supabase.from('profiles').update({ is_published: true, published_at: new Date() }).eq('id', userId)` | No | `qr-code-generator` Edge Function (generates downloadable QR code SVG/PNG) |

### Part Two Annotations
- **Draft Persistence**: Onboarding steps write transient data into `SessionStorage` and `LocalStorage` so users do not lose progress if they accidentally refresh or navigate away.
- **Slug Validation RPC**: `check_slug_availability` executes a fast indexed SQL check to verify slug uniqueness before committing.
- **Proof Storage Security**: User uploads are stored in an isolated Supabase Storage bucket (`evidence-vault`) with strict file type (`.pdf`, `.png`, `.jpg`) and size restrictions (5 MB max).

---

## Part Three — The Dashboard

| Page | Route | Client-side Storage | Supabase Call | Real-time | Edge Function |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Dashboard Home** | `/dashboard` | `Cookies` (session JWT token), `SessionStorage` (cached overview stats) | `supabase.from('profiles').select('*')`, `supabase.from('activity_feed').select('*').limit(10)` | Yes (`postgres_changes` on `messages` & `verifications`) | None |
| **Edit Profile** | `/dashboard/profile` | `LocalStorage` (`profile_edit_draft` backup copy) | `supabase.from('profiles').update({ headline, bio, location, links }).eq('id', userId)` | No | None |
| **Projects** | `/dashboard/projects` | `SessionStorage` (cached project list) | `supabase.from('projects').upsert(...)`, `supabase.from('projects').delete().eq('id', projId)` | No | None |
| **Products** | `/dashboard/products` | `SessionStorage` (cached product inventory grid) | `supabase.from('products').upsert(...)`, `supabase.from('products').delete().eq('id', prodId)` | No | None |
| **Your Proof** | `/dashboard/evidence` | `SessionStorage` (cached evidence array with signed URLs) | `supabase.from('evidence_items').select('*').order('created_at', { ascending: false })` | No | `signed-url-generator` Edge Function (generates short-lived 15-min signed file links) |
| **Get Verified** | `/dashboard/verifications`| `LocalStorage` (recently sent verification tokens) | `supabase.from('verification_requests').insert({ claim_id, verifier_email, status: 'pending' })` | Yes (`postgres_changes` on `verification_requests`) | `verification-mailer` Edge Function (dispatches token link email to verifier) |
| **Messages** | `/dashboard/inbox` | `SessionStorage` (cached conversation threads & read state) | `supabase.from('messages').select('*').order('created_at', { ascending: false })` | Yes (`postgres_changes` on `messages` table for new incoming messages) | None |
| **Insights** | `/dashboard/insights` | `LocalStorage` (`insights_date_range`: `'7d'`, `'30d'`, `'90d'`) | `rpc('get_profile_analytics_summary', { p_profile_id, p_date_range })` | No | `analytics-aggregator` Edge Function (nightly cron job summarizing traffic logs) |
| **Settings** | `/dashboard/settings` | `Cookies` (auth tokens), `LocalStorage` (notification preferences) | `auth.updateUser({ password: newPassword })`, `supabase.from('user_settings').upsert(...)` | No | `account-deletion-cleanup` Edge Function (wipes storage files & records on account deletion) |

### Part Three Annotations
- **Real-time Live Channels**: The Dashboard Home, Inbox, and Verifications screens subscribe to real-time PostgreSQL replication channels. When a verifier confirms a claim, the status badge transforms live from `Pending` to `★ VERIFIED ★` without a page refresh.
- **Signed Storage URLs**: Private evidence documents use short-lived signed URLs (15-minute expiration) generated on demand via Edge Functions, maintaining strict privacy control.

---

## Part Four — What the World Sees (Public Pages)

| Page | Route | Client-side Storage | Supabase Call | Real-time | Edge Function |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Public Person Profile** | `/{slug}` | `Cookies` (`anon_visitor_id` cookie for analytics tracking) | `supabase.from('profiles').select('*, profile_capabilities(*), evidence_items(*), verifications(*)').eq('slug', slug)` | No | `public-profile-ssr` Edge Function (renders HTML at Cloudflare Edge + OpenGraph meta tags) |
| **Public Business Profile** | `/business/{slug}` | `Cookies` (`anon_visitor_id` cookie for unique visitor tracking) | `supabase.from('profiles').select('*, products(*), evidence_items(*), verifications(*)').eq('slug', slug)` | No | `public-profile-ssr` Edge Function (renders HTML at Cloudflare Edge + OpenGraph meta tags) |
| **Confirm Claim** | `/verify/{token}` | None | `rpc('confirm_verification_request', { p_token, p_verdict, p_note })` | No | `verification-notifier` Edge Function (alerts profile owner of verifier's response) |
| **Request a Quote / Contact**| `/{slug}/contact` | `LocalStorage` (`visitor_contact_info` pre-fills sender details) | `supabase.from('messages').insert({ profile_id, sender_name, sender_email, subject, message_body })` | No | `contact-rate-limiter` Edge Function (enforces max 3 messages/hr per IP & dispatches notification email) |
| **Discover** | `/discover` | `LocalStorage` (`search_history`, recent filter chips) | `rpc('search_profiles_and_capabilities', { p_query, p_category, p_location, p_availability })` | No | `search-indexer` Edge Function (ranks profiles based on verified proof weight & relevance) |

### Part Four Annotations
- **Server-Side Rendering (SSR) & OpenGraph**: Public profile routes (`/{slug}` and `/business/{slug}`) utilize Cloudflare Edge Functions to generate HTML on the fly with dynamic OpenGraph meta cards for Twitter/LinkedIn sharing.
- **Public Contact Rate Limiting**: The contact form is guarded by a serverless Edge Function that tracks IP attempt rates to prevent spam while pre-filling visitor details from `LocalStorage` on repeat visits.
- **Deterministic Search RPC**: `/discover` executes a vector/keyword search RPC that weights profiles higher based on their count of verified credentials.

---

## Part Five — Handling & Admin

| Page | Route | Client-side Storage | Supabase Call | Real-time | Edge Function |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Report Modal** | Primitive (`ReportModal`) | None | `supabase.from('reports').insert({ target_profile_id, reason, details, reporter_ip })` | No | `trust-safety-alert` Edge Function (dispatches high-priority alert for impersonation reports) |
| **Admin Reports** | `/admin/reports` | `Cookies` (`admin_jwt_session`) | `supabase.from('reports').select('*').order('created_at', { ascending: false })`, `supabase.from('reports').update({ status }).eq('id', reportId)` | Yes (`postgres_changes` on `reports` table for immediate incident response) | `admin-takedown-handler` Edge Function (handles profile suspension, warning emails, & search delisting) |
| **404 Not Found** | `/404` | None | None — purely static client fallback view | No | None |
| **500 Server Error** | `/error` | `LocalStorage` (`last_error_stack` for debugging export) | None | No | `error-logger` Edge Function (ingests client crash logs & sends maintainer notification) |

### Part Five Annotations
- **Admin Real-time Control Room**: The Admin Reports table connects to a Supabase Realtime channel to display incoming report tickets instantly as visitors flag pages.
- **Takedown Cascade**: Admin actions (e.g., `Take page down`) trigger the `admin-takedown-handler` Edge Function, which immediately revokes public page access, unlinks search indexes, and notifies the account owner via email.

---

## 📌 Summary Matrix of All 28 System Routes

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 PROOF-ID DATA FLOW SYSTEM MATRIX                             │
├────────────────────────────┬─────────────────────────────┬───────────┬──────────────────────┤
│ ROUTE                      │ CLIENT STORAGE              │ REAL-TIME │ EDGE FUNCTION        │
├────────────────────────────┼─────────────────────────────┼───────────┼──────────────────────┤
│ /                          │ LocalStorage, Cookies       │ No        │ Edge CDN             │
│ /login                     │ Cookies (Auth JWT)          │ No        │ Supabase Auth        │
│ /signup                    │ Cookies, LocalStorage       │ No        │ DB Auth Trigger      │
│ /onboarding/type           │ SessionStorage              │ No        │ None                 │
│ /onboarding/slug           │ LocalStorage                │ No        │ None                 │
│ /onboarding/basics         │ LocalStorage                │ No        │ image-optimizer      │
│ /onboarding/basics-business│ LocalStorage                │ No        │ image-optimizer      │
│ /onboarding/capabilities   │ LocalStorage                │ No        │ None                 │
│ /onboarding/proof          │ SessionStorage              │ No        │ evidence-verifier    │
│ /onboarding/preview        │ SessionStorage              │ No        │ ssr-preview-renderer │
│ /onboarding/published      │ LocalStorage                │ No        │ qr-code-generator    │
│ /dashboard                 │ Cookies, SessionStorage     │ YES       │ None                 │
│ /dashboard/profile         │ LocalStorage                │ No        │ None                 │
│ /dashboard/projects        │ SessionStorage              │ No        │ None                 │
│ /dashboard/products        │ SessionStorage              │ No        │ None                 │
│ /dashboard/evidence        │ SessionStorage              │ No        │ signed-url-generator │
│ /dashboard/verifications   │ LocalStorage                │ YES       │ verification-mailer  │
│ /dashboard/inbox           │ SessionStorage              │ YES       │ None                 │
│ /dashboard/insights        │ LocalStorage                │ No        │ analytics-aggregator │
│ /dashboard/settings        │ Cookies, LocalStorage       │ No        │ account-deletion     │
│ /{slug}                    │ Cookies                     │ No        │ public-profile-ssr   │
│ /business/{slug}           │ Cookies                     │ No        │ public-profile-ssr   │
│ /verify/{token}            │ None                        │ No        │ verification-notifier│
│ /{slug}/contact            │ LocalStorage                │ No        │ contact-rate-limiter │
│ /discover                  │ LocalStorage                │ No        │ search-indexer       │
│ ReportModal                │ None                        │ No        │ trust-safety-alert   │
│ /admin/reports             │ Cookies (Admin JWT)         │ YES       │ admin-takedown       │
│ /404 & /error              │ LocalStorage (Stack log)    │ No        │ error-logger         │
└────────────────────────────┴─────────────────────────────┴───────────┴──────────────────────┘
```
