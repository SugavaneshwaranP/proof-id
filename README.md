# Proof-Backed Identity Network

> **Development Specification & Baseline Documentation**  
> *Built for Claude Code / coding-agent workflows / Antigravity*

---

## 🎯 Executive Summary

**Proof-Backed Identity Network** is a production-quality web application where the core primitive is:
$$\text{Identity} \longrightarrow \text{Claims} \longrightarrow \text{Evidence} \longrightarrow \text{Verification} \longrightarrow \text{Share}$$

The platform supports two profile types from day one:
1. **Person Profiles**: Professionals, freelancers, engineers, and creators showcasing verified skills, projects, and evidence.
2. **Business Profiles**: Manufacturers, suppliers, service providers, distributors, and agencies detailing capacities, certifications, products, MOQs, and lead times.

---

## 🏛️ Engineering Principles & Core Mandates

- **Modular Monolith over Microservices**: Maintain a clean monorepo architecture with strict module boundaries.
- **Deterministic Rules over Black-Box AI**: 100% AI-free core functionality. Profile completion, discovery scoring, and verification functions use transparent, deterministic algorithms.
- **Free Managed Infrastructure over Self-Hosted**: Leverage high-reliability free tiers (Cloudflare Pages/Workers + Supabase + Vercel).
- **Security-First RLS**: Service-role keys never reach the browser; every table enforces explicit Row Level Security (RLS).

---

## 📁 Repository Structure

```
/proof-id
 ├── /apps
 │   ├── /web              # React + Vite + Tailwind CSS web application
 │   └── /edge             # Cloudflare Workers / Edge API functions
 ├── /packages
 │   ├── /ui               # Shared UI component primitives
 │   ├── /types            # Shared TypeScript definitions & schemas
 │   └── /validation       # Shared Zod validation schemas
 ├── /supabase
 │   ├── /migrations       # Postgres DDL & RLS policies
 │   ├── /seed             # Seed data for local testing
 │   └── /functions        # Edge functions
 ├── /docs
 │   ├── PRODUCT.md        # Product requirements & deterministic logic
 │   ├── ARCHITECTURE.md   # Tech stack, deployment & free-tier limits
 │   ├── DATA_MODEL.md     # Domain entities & database schemas
 │   ├── SECURITY.md       # RLS permissions matrix & security rules
 │   ├── API.md            # Endpoint specifications & contracts
 │   ├── TEST_PLAN.md      # Testing matrix & critical E2E flows
 │   ├── ACCEPTANCE.md     # UX criteria, release gates & final tests
 │   └── AGENT_RULES.md   # Operating rules for AI coding agents
 ├── /tests
 │   ├── /e2e              # Playwright E2E test suites
 │   └── /integration      # Vitest integration tests
 ├── /scripts              # Build & deployment utility scripts
 └── README.md             # Main project readme
```

---

## 📚 Documentation Index

For complete details on system design, database schemas, API specifications, and testing strategies, consult the documentation in `/docs`:

| Document | Description |
| :--- | :--- |
| [PRODUCT.md](file:///s:/proof-id/docs/PRODUCT.md) | Scope, profile schemas, completion engine, and deterministic matching logic. |
| [ARCHITECTURE.md](file:///s:/proof-id/docs/ARCHITECTURE.md) | Technical stack, edge topology, monorepo setup, and free-tier discipline. |
| [DATA_MODEL.md](file:///s:/proof-id/docs/DATA_MODEL.md) | 29 domain entities, Postgres database DDL, and key relationships. |
| [SECURITY.md](file:///s:/proof-id/docs/SECURITY.md) | Row Level Security (RLS) matrix, file access policies, and threat mitigations. |
| [API.md](file:///s:/proof-id/docs/API.md) | REST/Supabase endpoints, payload schemas, and access boundaries. |
| [TEST_PLAN.md](file:///s:/proof-id/docs/TEST_PLAN.md) | Multi-layered testing strategy and step-by-step E2E scenarios. |
| [ACCEPTANCE.md](file:///s:/proof-id/docs/ACCEPTANCE.md) | UX acceptance criteria, 9 release gates, and final acceptance test. |
| [AGENT_RULES.md](file:///s:/proof-id/docs/AGENT_RULES.md) | 12 mandatory rules for AI coding agents and task templates. |
| [DEVELOPMENT_WORKFLOW.md](file:///s:/proof-id/docs/DEVELOPMENT_WORKFLOW.md) | 6-step single-feature vertical slice workflow & task-by-task execution flow. |

---

## 🗓️ Development Roadmap (30 / 60 / 90 Days)

| Days | Focus | Deliverables |
| :---: | :--- | :--- |
| **1 - 7** | Architecture & Validation | Docs, schemas, monorepo bootstrap, prototype validation. |
| **8 - 30** | Core Person Profile | Auth, profile creation, evidence upload, public renderer. |
| **31 - 45** | Business Profiles | Business details, capabilities, products, certificates, MOQs. |
| **46 - 60** | Trust & Verification | Verification workflow, secure links, verifier page, reporting. |
| **61 - 75** | Share & Analytics | QR generation, Open Graph metadata, public profile analytics. |
| **76 - 90** | Discovery Beta | Deterministic search, filtering, shortlist & saved profiles. |

---

## 🚀 Quick Start

1. **Clone & Install Dependencies**:
   ```bash
   git clone <repository-url>
   cd proof-id
   npm install
   ```

2. **Run Local Web App**:
   ```bash
   npm run dev
   ```

3. **Run Suite of Tests**:
   ```bash
   npm run test
   ```
