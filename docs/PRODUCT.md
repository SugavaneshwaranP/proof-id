# Product Specification & Requirements

> **Document Path**: `docs/PRODUCT.md`  
> **Module**: Core Product Vision, Scope, UX Flows & Deterministic Engines

---

## 1. Product Mandate & Core Primitive

The **Proof-Backed Identity Network** is a web platform designed to replace unverified resume claims and ungrounded marketing copy with verifiable, evidence-backed profiles.

The foundational primitive of the entire application is:
$$\text{Identity} \longrightarrow \text{Claims} \longrightarrow \text{Evidence} \longrightarrow \text{Verification} \longrightarrow \text{Share}$$

### Profile Types
- **Person Profile**: For engineers, designers, consultants, and individual professionals.
- **Business Profile**: For manufacturers, wholesalers, distributors, service providers, exporters, and agencies.

---

## 2. Scope & Non-Goals

| Build Now (MVP) | Do Not Build in MVP |
| :--- | :--- |
| Auth and onboarding | AI writing / AI matching |
| Person & business profile schemas | Social feed |
| Skills & capabilities taxonomy | Follower system |
| Projects & products listings | Complex job board |
| Evidence file & link attachment | Payments / escrow integration |
| Verification request workflow | Real-time chat |
| Public profile pages & renderer | Native mobile app |
| Share links & QR code generation | Microservices architecture |
| Basic analytics (views & shares) | Automated AI moderation |
| Reports & admin dashboard | Dozens of complex templates |

### Definition of "AI-Free"
No LLM API, vector database, embeddings, autonomous agents, or AI-generated ranking is permitted for any core user journey. All profile quality indicators, matching scores, and verification functions must remain 100% deterministic, explainable, and transparent.

---

## 3. Person & Business Profile Specifications

### Person Profile Fields
- **Identity**: Full Name, Headline, Location, Availability Status, Profile Slug.
- **Capability**: Capability Statement, 3–8 Normalized Capability Chips (with claim descriptions).
- **Projects**: Project Title, Role, Description, Technologies Used, Outcome Links.
- **Evidence**: Proof Links, File Attachments, Certificates, Target Links (to project/experience).
- **Verification**: Verified Badges with Verifier Context and Verification Scope.
- **Contact**: Preferred contact method (Email form, External URL, Social link).

### B2B Profile Specification
| Section | Minimum Fields |
| :--- | :--- |
| **Identity** | Legal Company Name, Business Type, Location, Operating Regions. |
| **Capability** | Business Role (Manufacturer / Wholesaler / Distributor / Service Provider / Exporter / Agency). |
| **Products** | Name, Category, Description, Minimum Order Quantity (MOQ), Lead Time. |
| **Capacity** | Capacity Description, Production Unit Size, Operating Scale. |
| **Facilities** | Factory/Facility Description, Photos, Machinery/Equipment list. |
| **Credentials** | Certificates, Registrations, Issuing Authority, Expiry Dates. |
| **Business Proof** | Website, Business Email, Optional Registration Documents. |
| **Commercial** | Payment Terms, Sample Availability, Shipping Regions. |
| **Contact** | Sales Contact Person, Preferred Channel. |
| **Freshness** | Last Updated Timestamp, Certificate & Product Effective Dates. |
| **Action** | Primary CTA: Request Quote / Contact Sales / Download Specs. |

---

## 4. UX Flow - MVP Journey

```
[SIGN UP]
   │
   ▼
[PROFILE TYPE SELECTION] ─── (Person OR Business)
   │
   ▼
[CLAIM UNIQUE SLUG]
   │
   ▼
[ONBOARDING WIZARD]
   │
   ▼
[ADD CAPABILITIES]
   │
   ▼
[ATTACH PROOF / EVIDENCE]
   │
   ▼
[PREVIEW PROFILE]
   │
   ▼
[PUBLISH PROFILE] ───► [SHARE & QR CODE] ───► [PUBLIC VIEWER] ───► [CONTACT / ENQUIRY]
```

### UX Acceptance Criteria
- **Draft Progress**: First-time users see explicit progress indicators and can save draft state at every step.
- **No Dead-Ends**: Missing optional fields never block workflow completion.
- **Minimal Credible Publish**: Publishing requires only the minimum credible information (Name/Company, 1 Capability, 1 Contact Method).
- **Primary Call to Action**: Every public page features exactly one clear primary CTA.
- **Mobile Usability**: All editing and viewing interfaces are fully functional and responsive on mobile devices.
- **No Login Sharing**: Public profiles and business specs can be shared, viewed, and downloaded without requiring authentication.

---

## 5. Profile Completion Engine (Deterministic)

Profile completeness is calculated strictly using explainable point values. It is **never** presented as "hireability," "quality," "trust score," or "best candidate." It is strictly a profile completeness indicator.

### Completion Score Formula
$$\text{Score} = \sum \text{Points (Max 100)}$$

| Criteria | Points | Condition |
| :--- | :---: | :--- |
| **Identity Fields** | +10 | Name, Headline, Location, and Avatar complete. |
| **Capability Statement** | +15 | Structured summary statement present. |
| **Capability Chips** | +15 | At least 3 normalized capabilities added. |
| **Proof / Evidence** | +20 | At least 1 verified or self-added evidence item attached. |
| **Project / Product** | +15 | At least 1 project (Person) or product (Business) listed. |
| **Contact Method** | +10 | Preferred contact method configured. |
| **Verification Request**| +5 | At least 1 verification request sent or completed. |
| **Profile Freshness** | +10 | Profile updated within the last 180 days. |

---

## 6. Deterministic Discovery & Matching Engine

Discovery scoring matches profiles to search requests or job/project requirements using a transparent, weighted algorithm.

### Person Matching Score Formula
$$\text{Match Score} = (C \cdot 0.40) + (E \cdot 0.25) + (A \cdot 0.10) + (L \cdot 0.05) + (X \cdot 0.05) + (F \cdot 0.05) + (V \cdot 0.10)$$

Where:
- $C$ = Capability Overlap Ratio ($0.0 - 1.0$)
- $E$ = Evidence Match Count Ratio ($0.0 - 1.0$)
- $A$ = Availability Status Match ($1.0$ if available, else $0.0$)
- $L$ = Location / Timezone Match ($1.0$ exact/remote, $0.5$ regional, $0.0$ mismatch)
- $X$ = Experience Level Match ($0.0 - 1.0$)
- $F$ = Profile Freshness Score ($1.0$ if $<30$ days, decreasing to $0.0$ at $>180$ days)
- $V$ = Verification Ratio ($0.0 - 1.0$)

**Decomposition Rule**: Every score rendered in the UI must display its exact breakdown, e.g.:
> *"Match Score: 87% — Matches Spring Boot; 3 relevant projects; verified project contribution; available now."*

### B2B Supplier Matching Variant
For B2B buyer requests, matching factors include:
$$\text{Supplier Match} = \text{Capability} + \text{MOQ Limit} + \text{Capacity} + \text{Certifications} + \text{Location} + \text{Export Capability} + \text{Freshness}$$
