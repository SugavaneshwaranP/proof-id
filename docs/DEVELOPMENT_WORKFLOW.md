# End-to-End Development Workflow & Task Execution Sequence

> **Document Path**: `docs/DEVELOPMENT_WORKFLOW.md`  
> **Module**: Single-Feature Vertical Slice Workflow & Chronological Task-by-Task Implementation Sequence

---

##  PART 1: The Vertical Slice Workflow (How to Develop 1 Feature)

Every feature in the **Proof-Backed Identity Network** is built as a self-contained **Vertical Slice**. Developers and AI coding agents must follow this strict 6-step lifecycle for every single task:

```
┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 1: PLAN & UNDERSTAND                                               │
│ Read PRODUCT.md, ARCHITECTURE.md, and DATA_MODEL.md.                     │
│ Formulate Task Context -> Goal -> Allowed Files -> Constraints -> Tests  │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │
                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 2: DATABASE & MIGRATIONS                                            │
│ Create versioned SQL migration in /supabase/migrations/<timestamp>_.sql   │
│ Apply DDL, Enums, Constraints, and explicit Row Level Security (RLS)     │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │
                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 3: DOMAIN TYPES & ZOD VALIDATION                                    │
│ Define TypeScript interfaces in /packages/types                          │
│ Define runtime Zod validation schemas in /packages/validation            │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │
                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 4: SERVICE & API LAYER                                              │
│ Build data fetchers, mutations, and domain logic in /services            │
│ Keep business logic out of UI components. Enforce allow-listed fields.   │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │
                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 5: UI COMPONENTS & PAGES                                            │
│ Build accessible UI with Tailwind CSS and Radix UI primitives            │
│ Implement loading states, error boundaries, empty states & draft saving   │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │
                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 6: VERIFICATION & CI/CD HEALTH                                      │
│ Run Vitest unit/component tests, SQL RLS tests, and Playwright E2E      │
│ Validate: tsc (types) -> oxlint (lint) -> vitest (tests) -> vite build   │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ PART 2: Sequential Task-by-Task Execution Flow (Tasks 1 to 20)

Below is the chronological, step-by-step roadmap for building the entire platform from zero to production readiness.

```
[PHASE 1: FOUNDATION] ───► [PHASE 2: PERSON PROFILE] ───► [PHASE 3: B2B & STORAGE]
  Tasks 1 – 2               Tasks 3 – 10                  Tasks 11 – 14
                                                                │
                                                                ▼
[PHASE 6: E2E & RELEASE] ◄─── [PHASE 5: SHARE & SEARCH] ◄─── [PHASE 4: TRUST & VERIFY]
  Task 20                     Tasks 17 – 19                 Tasks 15 – 16
```

---

### 🟢 PHASE 1: Monorepo Foundation & Setup (Days 1–7)

#### 📌 Task 1: Monorepo Bootstrap & Environment Setup
- **Goal**: Initialize monorepo directory layout, root configuration, and build toolchain.
- **Deliverables**:
  - Root `package.json` with npm workspaces (`/apps/web`, `/apps/edge`, `/packages/*`).
  - Shared `tsconfig.json`, `oxlint` config, and Vitest configuration.
  - Basic UI design system tokens in Tailwind CSS.
- **Verification**: Run `npm install` and `npm run test`.

#### 📌 Task 2: Supabase Project Setup & Database Migrations
- **Goal**: Configure Supabase local environment, initial SQL migrations, and database seed scripts.
- **Deliverables**:
  - `supabase/config.toml` setup.
  - `supabase/migrations/20261008000000_initial_schema.sql`.
  - Local seed script for testing capability taxonomies.
- **Verification**: Run `supabase start` and `supabase db reset`.

---

### 🔵 PHASE 2: Core Auth, Person Profile & Public Renderer (Days 8–30)

#### 📌 Task 3: Authentication & Protected Routes
- **Goal**: Implement user registration, login, session persistence, and router guards.
- **Deliverables**:
  - Supabase Auth provider integration (Email magic link & GitHub OAuth).
  - `/login` and `/signup` page views.
  - `<ProtectedRoute />` React Router guard component.
- **Verification**: Sign up a test user and verify JWT persistence.

#### 📌 Task 4: Profiles Table & RLS Authorization
- **Goal**: Deploy `profiles` table DDL migration with explicit RLS policies.
- **Deliverables**:
  - SQL DDL for `profiles` table and `profile_type_enum`, `visibility_enum`, `availability_enum`.
  - RLS policies allowing owner full CRUD and public read on published records.
- **Verification**: Run SQL RLS integration tests for owner vs anonymous access.

#### 📌 Task 5: Profile Onboarding Wizard
- **Goal**: Build multi-step onboarding wizard for selecting profile type (Person vs Business).
- **Deliverables**:
  - Onboarding step state machine (Type selection $\rightarrow$ Basic identity $\rightarrow$ Claim slug).
  - Draft auto-save capability using local storage / database draft state.
- **Verification**: Complete onboarding wizard on mobile and desktop viewports.

#### 📌 Task 6: Unique Slug Reservation & Claim System
- **Goal**: Build deterministic profile slug generator and real-time availability checker.
- **Deliverables**:
  - Slug sanitization logic (e.g., `Jane Doe` $\rightarrow$ `jane-doe`).
  - Database unique index constraint check on `profiles(slug)`.
  - Real-time UI availability feedback pill.
- **Verification**: Test collision handling when two users claim identical names.

#### 📌 Task 7: Capabilities Taxonomy & Relations
- **Goal**: Seed normalized capability taxonomy and build `profile_capabilities` relation handlers.
- **Deliverables**:
  - `capabilities` master taxonomy table populated with engineering, design, and business skills.
  - `profile_capabilities` table linking profiles to skills with custom `claim_text`.
  - Multi-select interactive capability chip picker in UI.
- **Verification**: Attach 5 capability chips to a profile and verify persistence.

#### 📌 Task 8: Person Profile Editor
- **Goal**: Construct profile dashboard editor for personal information.
- **Deliverables**:
  - Forms for Display Name, Headline, Bio Summary, Location, and Availability status.
  - Deterministic Profile Completion Progress Bar (+10 identity, +15 summary, +15 capabilities, etc.).
- **Verification**: Update profile details and observe immediate score recalculation.

#### 📌 Task 9: Project & Portfolio Management
- **Goal**: Build UI to create, edit, re-order, and delete project portfolio items.
- **Deliverables**:
  - `projects` and `project_capabilities` table schemas.
  - Project form modal (Title, Role, Description, Tech Stack tags, External URL).
- **Verification**: Add 2 projects to a profile and verify correct display order.

#### 📌 Task 10: Public Profile Renderer (Person)
- **Goal**: Build responsive public profile page answering the 4 core questions: *Who is this? What can they do? What proves it? What can I do next?*
- **Deliverables**:
  - `/profiles/:slug` public page route.
  - Allow-listed public field projection query.
  - Structured sections: Header, Capability Chips, Project Cards, Proof Badges, Primary Contact CTA.
- **Verification**: Open public profile URL in incognito browser and confirm zero private field leakage.

---

### 🟣 PHASE 3: Business Profile Extensions & Evidence Storage (Days 31–45)

#### 📌 Task 11: Business Extensions Database Schema
- **Goal**: Deploy DDL migrations for B2B profile extensions.
- **Deliverables**:
  - `business_details`, `business_capabilities`, and `business_products` tables.
  - Foreign key constraints referencing `profiles(id)`.
- **Verification**: Verify migration applies cleanly on top of core profile schema.

#### 📌 Task 12: Business Profile Editor
- **Goal**: Build B2B profile editor for commercial and manufacturing details.
- **Deliverables**:
  - B2B Editor UI (Company Legal Name, Business Role, Year Started, Employee Band, GSTIN, Website).
  - Product catalog manager (Product Name, Category, MOQ, Capacity, Lead Time, Private Label support).
- **Verification**: Create a Manufacturer business profile and list 3 products with MOQs.

#### 📌 Task 13: Secure File Upload & Signed Storage URLs
- **Goal**: Implement secure object storage for evidence documents and factory images.
- **Deliverables**:
  - Client-side image compression and file size cap enforcement ($<5\text{MB}$).
  - Supabase Storage bucket configuration with short-lived signed URLs ($<15\text{ mins}$).
- **Verification**: Upload a certificate PDF and verify private file link expires as expected.

#### 📌 Task 14: Evidence Lifecycle & Status Engine
- **Goal**: Build evidence management engine supporting external links and file attachments.
- **Deliverables**:
  - `evidence` table schema with status transitions (`self_added`, `pending`, `verified`, `expired`).
  - Evidence attachment modal linking proof items to profiles, projects, or products.
- **Verification**: Attach evidence link to a project and verify "Self-Added" badge rendering.

---

### 🟡 PHASE 4: Trust, Verification & Moderation (Days 46–60)

#### 📌 Task 15: Verification Requests & Verifier Page
- **Goal**: Implement peer/client verification request workflow with secure token links.
- **Deliverables**:
  - `verification_requests` and `verification_events` database tables.
  - Request verification modal (Verifier Email, Claim Scope, Relationship).
  - Standalone `/verify/:token` page allowing third-party verifiers to confirm or reject claims without login.
- **Verification**: Generate verification link, open in incognito, confirm claim, and verify profile badge transforms to "Verified".

#### 📌 Task 16: Reporting, Flagging & Moderation Flow
- **Goal**: Build public profile reporting flow and moderation administrative tools.
- **Deliverables**:
  - `reports` table schema.
  - Public profile "Report Profile" modal form.
  - Basic admin queue to review flagged profiles and take action.
- **Verification**: Submit a report against a profile and verify report record created in database.

---

### 🟠 PHASE 5: Shareability, Analytics & Deterministic Search (Days 61–90)

#### 📌 Task 17: Share Links, QR Codes & Open Graph Metadata
- **Goal**: Implement dynamic social sharing features and preview cards.
- **Deliverables**:
  - Dynamic QR Code generator modal for mobile scanning.
  - Open Graph (`og:title`, `og:image`, `og:description`) meta tag renderer for social link previews.
- **Verification**: Test share link preview tags using metadata parser tools.

#### 📌 Task 18: Analytics Event Table & Dashboard Metrics
- **Goal**: Build privacy-preserving analytics system to track profile engagement.
- **Deliverables**:
  - `profile_views` aggregate event table (incrementing view counters without tracking PII).
  - Analytics widget in user dashboard showing weekly view trends and share clicks.
- **Verification**: Visit a public profile multiple times and verify aggregate view count increments correctly.

#### 📌 Task 19: Deterministic Search & Capability Filtering
- **Goal**: Implement transparent discovery engine using Postgres text indexing.
- **Deliverables**:
  - `/search` route with capability filters, location filters, and availability toggles.
  - Deterministic score calculator rendering exact reason breakdowns (*"Matches React; 3 relevant projects; verified"*).
- **Verification**: Search for "React" and verify results order matches deterministic formula.

#### 📌 Task 20: Comprehensive E2E & Security Regression Suite
- **Goal**: Construct complete end-to-end automated test suite and security regression gates.
- **Deliverables**:
  - Playwright E2E suite covering: Sign up $\rightarrow$ Profile setup $\rightarrow$ Add capability $\rightarrow$ Add project $\rightarrow$ Add evidence $\rightarrow$ Publish $\rightarrow$ Incognito view $\rightarrow$ Contact request.
  - Security audit suite verifying IDOR, XSS, and RLS isolation.
- **Verification**: Run full test suite with `npm run test:e2e` and confirm 100% pass rate across all release gates.
