# Agent Operating Rules & Coding Conventions

> **Document Path**: `docs/AGENT_RULES.md`  
> **Module**: Guidelines & Constraints for AI Coding Agents (Claude Code / Antigravity)

---

## 🚨 Mandatory Agent Operating Rules

Every AI coding agent **MUST** read and adhere to these 12 rules before making any code modifications:

1. **Read Architectural Documentation First**: Always inspect `PRODUCT.md`, `ARCHITECTURE.md`, and `DATA_MODEL.md` before initiating work on any feature or refactor.
2. **Migration-Driven Schema Changes**: Never modify database tables or column types directly without creating a versioned Supabase SQL migration script in `/supabase/migrations`.
3. **Justify All Dependencies**: Never install additional npm packages or third-party dependencies without explicit technical justification and minimal footprint verification.
4. **Never Expose Secrets to Client**: Keep service-role keys, private API credentials, and administrative tokens strictly on the server/edge layer.
5. **Authorization Tests for Mutations**: Every new database mutation (insert, update, delete) must include accompanying authorization tests.
6. **Allow-List Public Fields**: Public API endpoints and queries must explicitly project allow-listed fields (`SELECT col1, col2`) rather than returning raw database rows (`SELECT *`).
7. **Encapsulate Business Logic in Services**: Keep business rules, scoring logic, and data transformations in reusable domain services (`/packages` or `/src/services`), not inline inside UI components.
8. **Test Happy Path & Security Boundaries**: Write unit and integration tests covering both successful operations and edge-case security failures (e.g., unauthorized access).
9. **One Vertical Slice at a Time**: Build features end-to-end in small, self-contained vertical slices (Schema $\rightarrow$ API $\rightarrow$ UI $\rightarrow$ Test).
10. **Verify Build Health Before Completion**: Always execute typecheck (`tsc`), linting (`oxlint`/`eslint`), test suites (`vitest`), and production builds (`vite build`) before claiming task completion.
11. **Keep Documentation Updated**: Synchronize `/docs` files immediately whenever data schemas, API contracts, or architectural designs change.
12. **Strict Scope Adherence**: Do not invent features, add unrequested libraries, or introduce scope creep beyond what is specified in `PRODUCT.md`.

---

## 📋 Recommended Coding-Agent Task Format

When prompting or tasking coding agents, structure tasks using this standard blueprint:

```
Context ──► Goal ──► Allowed Files ──► Constraints ──► Acceptance Tests ──► Security Requirements ──► Commands to Run ──► Definition of Done
```

---

## 📌 First 20 Coding-Agent Task Roadmap

| # | Task Title | Description & Target Deliverable |
| :---: | :--- | :--- |
| **1** | Monorepo Bootstrap | Initialize monorepo, TypeScript, linting, formatting, and Vitest configuration. |
| **2** | Database Setup | Create Supabase project config, initial migration files, and local seed scripts. |
| **3** | Auth Integration | Implement Supabase Auth, login/signup routes, session state, and protected route guards. |
| **4** | Profiles Table & RLS | Create `profiles` SQL table, foreign key constraints, and RLS policies for owner CRUD. |
| **5** | Profile Onboarding | Build multi-step onboarding wizard for Person vs. Business selection. |
| **6** | Slug Management | Implement unique profile slug reservation, validation, and collision handling. |
| **7** | Capabilities Taxonomy | Seed capability taxonomy tables and build `profile_capabilities` relation handlers. |
| **8** | Person Profile Editor | Create profile management UI for headline, summary, location, and availability. |
| **9** | Project & Evidence Editor | Build UI to add/edit projects and attach external proof URLs or documents. |
| **10**| Public Profile Renderer | Construct public profile page with allow-listed field rendering and single CTA. |
| **11**| Business Details Schema | Add `business_details`, `business_capabilities`, and `business_products` tables. |
| **12**| Business Profile Editor | Build B2B profile management UI (MOQs, lead times, capacity, and credentials). |
| **13**| Secure Storage & Files | Implement secure file upload to Supabase Storage with short-lived signed URLs. |
| **14**| Evidence Status Engine | Implement evidence status workflow (`self_added`, `pending`, `verified`, `expired`). |
| **15**| Verification Requests | Build verification link generator and public verifier confirmation page. |
| **16**| Reports & Moderation | Add report flag submission form and admin moderation dashboard tables. |
| **17**| Share, QR & Metadata | Implement dynamic QR code generator and Open Graph meta tag preview headers. |
| **18**| Analytics Event Log | Build privacy-preserving `profile_views` aggregate event tracking system. |
| **19**| Deterministic Search | Implement Postgres-indexed capability and name search with score breakdown. |
| **20**| E2E Security Suite | Construct comprehensive Playwright E2E suite and security regression tests. |
