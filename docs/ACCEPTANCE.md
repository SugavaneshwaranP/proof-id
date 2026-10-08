# Product Acceptance Criteria & Release Gates

> **Document Path**: `docs/ACCEPTANCE.md`  
> **Module**: Acceptance Criteria, Release Readiness & Final Verification

---

## 1. UX Acceptance Criteria

Every user interface component and journey must fulfill the following acceptance criteria:

1. **Progress & Draft State**: First-time users see explicit wizard progress and can save draft state at every step without losing input.
2. **No Dead-End Forms**: Missing optional data never blocks form submission or page navigation.
3. **Minimum Credible Publishing**: Publishing a profile requires only minimum credible information (Name, 1 Capability, 1 Contact Method).
4. **Focused Primary CTA**: Every public profile view presents exactly one prominent primary Call-to-Action (e.g., "Contact Person" or "Request Business Quote").
5. **Full Mobile Usability**: All profile editing, evidence uploading, and viewing operations are fully usable on mobile screens ($<375\text{px}$).
6. **Optimized Load Performance**: Public profile pages load in $<1.5$ seconds on mobile networks with pre-scaled web images.
7. **Login-Free Shareability**: Public profiles and business specs can be copied, viewed, printed, or exported to PDF without requiring authentication.

---

## 2. Release Gates

Before deploying any build to production, all 9 release gates must pass:

| Gate | Pass Condition |
| :--- | :--- |
| **Functional** | All MVP unit, component, RLS, and Playwright acceptance tests pass. |
| **Security** | Zero critical auth, RLS, or IDOR vulnerabilities in automated/manual audits. |
| **Privacy** | Public/private field isolation verified; private documents never exposed. |
| **Performance** | Public profiles load fast on mobile devices with high Lighthouse score ($\ge 90$). |
| **Accessibility** | Complete keyboard navigation support and readable WCAG AA contrast labels. |
| **SEO** | Canonical URLs, Open Graph title/image metadata, and sitemap policy active. |
| **Observability** | Error tracking and key system events logged to audit tables. |
| **Recovery** | Automated database export and backup restoration procedures verified. |
| **Abuse Protection** | Reporting workflow, rate limiting, and spam blocking mechanisms verified. |
| **Documentation** | System architecture, schema DDL, and API docs match deployed codebase. |

---

## 3. Product Acceptance Test — Final Narrative

> **Final Verification Statement**:  
> *"A new user can create either a person or business profile, add structured capabilities, attach at least one piece of evidence, publish a public page, and share it. A viewer can understand the capability, inspect proof, see freshness/verification status, and take one clear action. No AI service is necessary for the entire journey."*

### Business Profile Guarantee
For a business profile, the viewer can inspect standardized products/services, MOQ or capacity where applicable, certificates/documents with effective dates, operating geography, and trigger the primary enquiry action.

### Architectural Flexibility Guarantee
The core architecture is strictly modular to ensure future epics—such as search, buyer requirements, supplier comparisons, formal proposals, escrow payments, and organization sub-accounts—can be layered on top without rewriting the core identity and evidence framework.
