# Test Plan & Quality Assurance Matrix

> **Document Path**: `docs/TEST_PLAN.md`  
> **Module**: Quality Assurance, Testing Matrix & End-to-End Scenarios

---

## 1. Multi-Layered Testing Matrix

| Testing Layer | Primary Tool | Target Minimum Coverage | Focus Areas |
| :--- | :--- | :--- | :--- |
| **Unit Testing** | Vitest | 90%+ core logic | Profile score calculation, deterministic matching algorithm, field formatting, Zod schemas. |
| **Component Testing**| React Testing Library | Key user flows | Form validation, interactive capability selectors, evidence upload progress, modal states. |
| **Integration** | Vitest + Supabase Test DB | All CRUD mutations | Database operations, cascading deletes, foreign key integrity, edge function responses. |
| **RLS Authorization**| SQL Integration Tests | 100% of tables | Explicit verification that anon/other users cannot read private fields or mutate foreign rows. |
| **End-to-End (E2E)** | Playwright | Full journey | Sign up $\rightarrow$ Profile setup $\rightarrow$ Evidence attach $\rightarrow$ Publish $\rightarrow$ Incognito view $\rightarrow$ Contact. |
| **Security Testing** | Automated + Manual Audit | Zero high issues | IDOR prevention, XSS sanitization, upload MIME type spoofing, auth token expiration. |
| **Performance** | Lighthouse / Playwright | Performance score $\ge 90$ | Mobile page load time, Core Web Vitals, image layout shifts, payload size. |
| **Visual Testing** | Playwright Screenshots | Cross-browser | Responsive rendering on desktop, tablet, and mobile breakpoints. |

---

## 2. Critical End-to-End Scenario

The core acceptance pipeline must run cleanly in automated CI/CD:

```
[1. CREATE ACCOUNT]
       │
       ▼
[2. CREATE PERSON PROFILE]
       │
       ▼
[3. ADD CAPABILITY CHIPS]
       │
       ▼
[4. ADD PROJECT ITEM]
       │
       ▼
[5. ATTACH EVIDENCE ITEM]
       │
       ▼
[6. PUBLISH PROFILE]
       │
       ▼
[7. OPEN PUBLIC URL IN INCOGNITO MODE]
       │
       ▼
[8. VERIFY ONLY PUBLIC ALLOW-LISTED FIELDS ARE VISIBLE]
       │
       ▼
[9. SUBMIT CONTACT REQUEST VIA INCOGNITO FORM]
       │
       ▼
[10. CONFIRM OWNER RECEIVES CONTACT NOTIFICATION IN DASHBOARD]
```

---

## 3. Security & Vulnerability Test Checklist

- [ ] **IDOR Protection**: Verify User A cannot PATCH or DELETE User B's project, evidence, or product via direct ID manipulation.
- [ ] **XSS Injection**: Verify HTML/JavaScript injection inside `display_name`, `summary`, or `claim_text` is safely sanitized/escaped.
- [ ] **Upload Abuse**: Verify non-allowed file extensions (`.exe`, `.sh`, `.html`) are rejected by storage validation.
- [ ] **Auth Bypass**: Verify accessing protected routes without valid auth JWT redirects immediately to `/login`.
