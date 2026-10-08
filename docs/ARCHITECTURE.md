# Technical Architecture & System Infrastructure Specification

> **Document Path**: `docs/ARCHITECTURE.md`  
> **Brand Name**: Backed (Proof-Backed Identity Network)  
> **Module**: 100% Free-Tier Backend, Storage Strategy, Real-Time Architecture, and Cloudflare/Supabase Topology

---

## 1. System Topology & Architecture Rules

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             BROWSER CLIENT (React/Vite SPA)                      │
│   React 18/19 + Vite + LocalStorage + SessionStorage + IndexedDB + Cache API     │
│   Auth: Supabase Browser Client + PKCE Session Flow + Publishable Anon Key        │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                          CLOUDFLARE EDGE (Thin Layer)                             │
│   - Global Static Assets & CDN (Cloudflare Pages)                                │
│   - 10ms CPU Rate-Limiting & Security Headers (Cloudflare Workers + KV)           │
│   - Stale-While-Revalidate Edge Cache for Public Profiles                        │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                        SUPABASE (Single Source of Truth)                         │
│   - PostgreSQL Database behind Row Level Security (RLS)                          │
│   - Postgres Functions (RPC): check_slug, confirm_verification, search_profiles  │
│   - Auth Engine & PKCE Browser Token Storage                                     │
│   - Supabase Private Object Storage (Signed URLs)                                │
│   - 4 Scoped Real-time WebSocket Channels                                        │
│   - Serverless Edge Functions (Deno/TypeScript for secrets & emails)             │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### Core Architectural Principles
1. **Supabase is the sole source of truth**: Anything in the browser is disposable convenience/cache.
2. **RLS is the authorization boundary**: Frontend hides UI elements for UX; Postgres Row Level Security strictly enforces access rules on every request.
3. **Pure React/Vite SPA Authentication**: Pure client SPAs use Supabase Browser Client + PKCE session storage with publishable key and RLS enforcement. httpOnly cookies are reserved for environments with a dedicated Cloudflare BFF / SSR node.
4. **Keep Workers thin**: Free Cloudflare Workers get 10ms CPU time per request — reserved for rate limiting, security headers, and redirects.
5. **Real-time is earned, not default**: Wired strictly to 4 scoped channels (`profile:{id}:activity`, `evidence:{profile_id}`, `inbox:{profile_id}`, `admin:reports`) to stay far below the 200 concurrent connection limit.
6. **Every write has an idempotency strategy**: Mutations queue locally in IndexedDB if offline and execute through atomic Postgres RPCs.
7. **Cache the public, protect the private**: Public profile pages are edge-cached (`stale-while-revalidate`); private dashboard endpoints are strictly `no-store`.
8. **Verification tokens are hashed, single-use, and expiring**: Raw tokens are emailed once; only SHA-256 hashes are stored in the database.
9. **Admin actions run server-side with audit logging**: Admin takedowns execute via `moderate-action` Edge Function with `SERVICE_ROLE_KEY` and audit logs.
10. **Explicit testing of unauthorized paths**: Playwright & Vitest integration test suites attempt unauthorized SQL/RPC queries to verify RLS rejection.

---

## 2. Browser Storage Decision Matrix

| Storage Mechanism | What Lives Here | Why This One | Lifespan | Security Note |
| :--- | :--- | :--- | :--- | :--- |
| **Local Storage** | UI preferences (theme, last dashboard tab, tip flags, pre-signup referral tag), PKCE session state. | Small, synchronous values that survive across visits. | Persistent until manually cleared. | Non-secret UI preferences & standard SPA session tokens. |
| **Session Storage** | Onboarding step draft, Discover search filters, "just published" flag. | Temporary workflow state meant to vanish when tab closes. | Cleared on tab close. | Non-sensitive UI state only. |
| **IndexedDB** | Autosaved form drafts, cached projects/products for instant paint, offline queue. | Structured, sizeable transactional data (few hundred KB). | Cleared once confirmed saved to Supabase. | Holds user draft content only; never secret keys. |
| **Cache API** | Compiled app shell (JS/CSS/fonts) and stale-while-revalidate public profile cards. | Purpose-built store for network response copies for repeat-visit speed. | Replaced on deploy / SWR expiry. | Scoped to public, cacheable content only. |
| **Cookies** | Optional visitor tracking ID (`anon_visitor_id`). | Used for anonymous analytics deduplication at the Cloudflare edge. | Session duration. | Non-sensitive tracking ID only. |

---

## 3. Real-Time Architecture (4 Scoped Channels)

| Channel | Listens To Table & Event | Powers Feature |
| :--- | :--- | :--- |
| `profile:{id}:activity` | `contact_requests` (insert), `verification_events` (insert) | Dashboard Home live activity feed |
| `evidence:{profile_id}` | `evidence_items` (update), `verification_events` (insert) | Live "Confirmed" badge updates on profile & proof pages |
| `inbox:{profile_id}` | `contact_requests` (insert) | Instant inbox arrival without page refresh |
| `admin:reports` | `reports` (insert) | Real-time moderation ticket queue for admins |

---

## 4. End-to-End Key Workflows

1. **Sign Up $\rightarrow$ Onboarding $\rightarrow$ Publish**: Form submits to `supabase.auth.signUp()`. Postgres trigger creates draft profile. Onboarding writes keystrokes to `IndexedDB` and step updates to Supabase. `check_slug_availability` RPC checks slug uniqueness. Publish sets `is_published = true`.
2. **Request Verification $\rightarrow$ Verifier Confirms $\rightarrow$ Badge Updates Live**: Profile owner submits request. `send-verification-email` Edge Function generates single-use token, computes SHA-256 hash, and emails link to `/verify/{token}`. Verifier clicks link, calling `confirm_verification` RPC. RPC verifies hash, updates `evidence.status` to `verified`, and broadcasts to `evidence:{profile_id}` channel.
3. **Visitor Quote Request $\rightarrow$ Edge Rate Limit $\rightarrow$ Owner Notified**: Cloudflare Worker checks KV counter (max 5/hr per IP). On pass, inserts `contact_requests` row. Real-time message broadcasts to `inbox:{profile_id}` channel.
4. **Visitor Report $\rightarrow$ Admin Moderation Takedown**: Visitor files report. Admin queue updates live via `admin:reports` channel. Takedown call executes via `moderate-action` Edge Function using `SERVICE_ROLE_KEY` with audit logging.

---

## 5. Published Free-Tier Budget Discipline

| Service Provider | Free Tier Metric | Limit | Optimization Strategy |
| :--- | :--- | :--- | :--- |
| **Supabase Postgres** | DB Storage | 500 MB | Relational schema with normalized FK indexes |
| **Supabase Storage** | Private File Vault | 1 GB | Client-side image compression (max 5 MB / file) |
| **Supabase Auth** | Monthly Active Users | 50,000 MAU | PKCE token auto-refresh |
| **Supabase Realtime** | Concurrent Connections | 200 Peak | Strictly 4 scoped channels, disconnected when idle |
| **Supabase Edge Functions** | Monthly Invocations | 500,000 / mo | Postgres RPCs for data-only queries |
| **Cloudflare Workers** | Daily Request Limit | 100,000 / day | Keep worker execution $< 10\text{ ms}$ CPU |
| **Cloudflare KV** | Daily Writes | 1,000 / day | Expiration TTL rate-limiting counter keys |
