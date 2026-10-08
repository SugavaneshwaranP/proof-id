# API Boundary & Endpoint Specifications

> **Document Path**: `docs/API.md`  
> **Module**: API Contracts, Payload Schemas & Access Enforcement

---

## 1. API Boundary Overview

The API layer is exposed via Supabase REST endpoints and lightweight Cloudflare Worker edge functions.

| Area | Endpoint Example | Access Rule | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `Supabase Auth` | Managed Auth | Magic links, email/password, GitHub OAuth session management. |
| **Profiles** | `GET /profiles/:slug` | Public Read | Returns allow-listed public fields for published profiles. |
| **Profiles** | `PATCH /profiles/:slug` | Owner Only | Updates profile headline, summary, location, availability. |
| **Projects** | `POST /projects` | Owner Only | Creates a new project item linked to the owner's profile. |
| **Products** | `POST /products` | Business Only | Adds a B2B product (MOQ, capacity, lead time). |
| **Evidence** | `POST /evidence` | Owner Only | Validates file type, size, ownership, and uploads asset. |
| **Verification** | `POST /verification-requests` | Owner Only | Generates a scoped claim verification request and token link. |
| **Verification** | `GET /verify/:token` | Verifier Link | Verifier view to confirm or reject specific requested claim. |
| **Contact** | `POST /contact-requests` | Rate-Limited | Allows anonymous/signed-in users to message profile owners. |
| **Search** | `GET /search?q=&type=` | Public Only | Indexed Postgres text search across public profiles/products. |
| **Matching** | `GET /requirements/:id/matches`| Authenticated | Computes deterministic match scores against requirements. |

---

## 2. Key Endpoint Schemas

### Public Profile Payload: `GET /profiles/:slug`
```json
{
  "id": "u-9842-uuid",
  "slug": "jane-doe",
  "profile_type": "person",
  "display_name": "Jane Doe",
  "headline": "Senior Full Stack Engineer",
  "summary": "10+ years building web applications",
  "location": "San Francisco, CA",
  "availability": "available_now",
  "published_at": "2026-10-01T12:00:00Z",
  "capabilities": [
    {
      "name": "React",
      "slug": "react",
      "category": "Frontend",
      "claim_text": "Built enterprise design system with 50+ components"
    }
  ],
  "evidence": [
    {
      "id": "ev-101",
      "title": "Open Source Contribution",
      "evidence_type": "url",
      "source_url": "https://github.com/example/pull/42",
      "status": "verified"
    }
  ]
}
```

### Verification Request Payload: `POST /verification-requests`
```json
{
  "evidence_id": "ev-101",
  "verifier_email": "colleague@company.com",
  "claim_scope": "Verified contribution as lead frontend architect on Project X",
  "relationship": "Direct Manager"
}
```

### Response:
```json
{
  "request_id": "vr-5501",
  "status": "pending",
  "token_url": "https://proofid.network/verify/abc123tokenhash"
}
```

---

## 3. Rate-Limiting & Input Validation

- **Validation Schema**: All incoming HTTP payloads are validated against strict Zod schemas before processing.
- **Spam Mitigation**: Contact forms enforce a 3-request-per-minute ceiling per IP address using Cloudflare edge KV rate limiters.
