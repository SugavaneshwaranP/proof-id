# Comprehensive Security Specification & Defense-in-Depth Model

> **Document Path**: `docs/SECURITY.md`  
> **Brand Name**: Backed (Proof-Backed Identity Network)  
> **Purpose**: Production Security Specification, Threat Matrix, Defense-in-Depth Controls, and Incident Response Playbook.

---

## 🛡️ 20-Layer Security Control Specification

| Layer / Control | Technical Standard & Implementation |
| :--- | :--- |
| **Transport** | **TLS 1.3** enforced with forward secrecy across all edge and database network hops. |
| **TLS Cipher** | High-strength ciphers: **AES-GCM** and **ChaCha20-Poly1305**. |
| **HTTPS Enforcement** | **HSTS** (`Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`). |
| **CDN / Edge WAF** | **Cloudflare Workers & Pages** edge layer with custom rate-limiting KV counters. |
| **Browser Security** | Strict **Content Security Policy (CSP)**, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`. |
| **Authentication** | **Supabase Auth** managed identity with PKCE flow and publishable key architecture. |
| **Strong Login** | **MFA (TOTP)** and **Passkeys (WebAuthn)** support for account verification. |
| **Authorization** | **Postgres Row Level Security (RLS)** as the non-bypassable server authorization gatekeeper. |
| **Database at Rest** | Managed **AES-256** class encryption for tables, WAL logs, and disk volumes. |
| **Sensitive Secrets** | **Supabase Vault** and server environment secrets (never exposed to browser bundles). |
| **Sensitive Fields** | **Application-level AEAD** / `pgcrypto` envelope encryption (`pgp_sym_encrypt`). |
| **Passwords** | Managed exclusively by Supabase Auth (bcrypt/argon2); zero custom password tables. |
| **Files** | Private Supabase Storage bucket (`evidence-vault`) accessed via short-lived signed URLs ($<15\text{ mins}$). |
| **Verification** | Single-use, expiring, high-entropy tokens stored strictly as SHA-256 hashes (`token_hash`). |
| **Abuse Protection** | Cloudflare Worker IP rate limiting (5 POSTs/hr per IP) + Postgres schema constraints. |
| **Admin Controls** | Server-side authorization via `moderate-action` Edge Function + immutable audit logging. |
| **Realtime Security** | Authorized private WebSocket channels filtered by Postgres RLS policy subscriber rules. |
| **Cache Scoping** | `stale-while-revalidate` for public profile cards; strict `no-store` on private dashboard endpoints. |
| **Secret Isolation** | `SUPABASE_SERVICE_ROLE_KEY` restricted to Edge Functions; never browser-accessible. |
| **Logging & Redaction** | Zero tokens, passwords, or private secrets in telemetry or server logs. |

---

## 🔒 Defense-in-Depth Control Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                              DEFENSE-IN-DEPTH SECURITY CHAIN                                │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│  [Passkeys / MFA] ──► [Device / Session Mgmt] ──► [Strict CSP] ──► [WAF / Bot Protection]   │
│          │                                                                                  │
│          ▼                                                                                  │
│  [IP Risk Controls] ──► [Envelope Encryption] ──► [Dedicated KMS] ──► [Key Rotation]         │
│          │                                                                                  │
│          ▼                                                                                  │
│  [Network Isolation] ──► [Immutable Audit Logging] ──► [Continuous Vuln Scanning]           │
│          │                                                                                  │
│          ▼                                                                                  │
│  [Supply-Chain Checks] ──► [Penetration Testing] ──► [SIEM] ──► [Incident Response]        │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## ⚙️ Detailed Security Implementation Specifications

### 1. Immutable Audit Logging (`public.audit_events`)
- **Immutability Enforcement**: Database trigger `prevent_audit_log_tampering` rejects any `UPDATE` or `DELETE` attempt on audit logs.
- **Logged Events**: Admin moderation actions (`PROFILE_TAKEDOWN`, `WARNING_DISPATCHED`), verification status flips, and sensitive profile updates.

```sql
CREATE TABLE IF NOT EXISTS public.audit_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID,
    ip_address TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

### 2. Edge Content Security Policy & Security Headers ([rate-limiter.js](file:///s:/proof-id/workers/rate-limiter.js))
- **HSTS**: `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- **CSP Directive**:
  ```http
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://*.supabase.co; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https://*.supabase.co; connect-src 'self' https://*.supabase.co wss://*.supabase.co; frame-ancestors 'none'; object-src 'none'; base-uri 'self';
  ```
- **Frame Ancestors & Permissions**: `X-Frame-Options: DENY`, `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`.

### 3. Application-Level Envelope Encryption (`pgcrypto`)
- Sensitive stored fields (such as internal notes or verifier tokens) utilize symmetric envelope encryption via PostgreSQL's `pgcrypto` extension (`encrypt_sensitive_field` / `decrypt_sensitive_field`).

### 4. Supply-Chain & Dependency Security
- Automated dependency auditing (`npm audit`).
- Pinning exact package versions in `package-lock.json`.
- Strict secret scanning preventing accidental git commits of `.env` or service role keys.
