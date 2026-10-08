# Domain Model & Database Schema

> **Document Path**: `docs/DATA_MODEL.md`  
> **Module**: Relational Architecture, Table Definitions & Database Enums

---

## 1. Domain Model Entity Overview

The system consists of 29 domain entities categorized into 6 core modules:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                             CORE IDENTITY                               │
│   users ───► profiles ───► profile_settings                            │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
┌─────────────────┐       ┌────────────────────┐      ┌────────────────────┐
│   CAPABILITIES  │       │     PORTFOLIO      │      │    B2B EXTENSION   │
│                 │       │                    │      │                    │
│ capabilities    │       │ projects           │      │ business_details   │
│ profile_caps    │       │ project_caps       │      │ business_caps      │
│                 │       │ products           │      │ business_products  │
│                 │       │ product_caps       │      │ business_documents │
│                 │       │ experiences        │      │ business_facilities│
│                 │       │ educations         │      │ business_contacts  │
│                 │       │ links              │      │                    │
└─────────────────┘       └──────────┬─────────┘      └────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         EVIDENCE & TRUST ENGINE                         │
│   evidence ───► verification_requests ───► verification_events         │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
         ┌───────────────────────────┴───────────────────────────┐
         ▼                                                       ▼
┌─────────────────┐                                     ┌──────────────────┐
│ DISCOVERY & B2B │                                     │  SYSTEM & TRUST  │
│                 │                                     │                  │
│ requirements    │                                     │ share_links      │
│ req_caps        │                                     │ profile_views    │
│ shortlists      │                                     │ contact_requests │
│                 │                                     │ saved_profiles   │
│                 │                                     │ reports          │
│                 │                                     │ audit_events     │
└─────────────────┘                                     └──────────────────┘
```

---

## 2. Key Relationships

1. `profiles.user_id -> users.id` (1:1 link to Supabase auth user).
2. `profile_capabilities` maps normalized taxonomy capabilities to a profile with user claim text.
3. `projects` and `products` attach to profiles; project/product capability links provide contextual tags.
4. `evidence` attaches to a profile, project, product, experience, or business document.
5. `verification_requests` reference one exact evidence item or claim statement.
6. `business_details` extends a profile whose `profile_type = 'business'`.
7. `requirements` utilize the same normalized `capabilities` taxonomy as profiles for deterministic matching.
8. `audit_events` log security-sensitive mutations, RLS changes, and visibility toggles.

---

## 3. Database Enums

```sql
CREATE TYPE profile_type_enum AS ENUM ('person', 'business');
CREATE TYPE visibility_enum AS ENUM ('public', 'unlisted', 'private');
CREATE TYPE availability_enum AS ENUM ('available_now', 'open_to_offers', 'not_available');
CREATE TYPE target_type_enum AS ENUM ('profile', 'project', 'product', 'experience', 'document');
CREATE TYPE evidence_type_enum AS ENUM ('url', 'file', 'certificate', 'verification');
CREATE TYPE evidence_status_enum AS ENUM ('self_added', 'pending', 'verified', 'rejected', 'expired');
CREATE TYPE business_capability_enum AS ENUM (
  'manufacturer', 'wholesaler', 'distributor', 'service_provider', 'exporter', 'agency'
);
```

---

## 4. Core Table DDL Specifications

### `profiles`
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_type profile_type_enum NOT NULL DEFAULT 'person',
  slug TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  headline TEXT,
  summary TEXT,
  location TEXT,
  availability availability_enum DEFAULT 'open_to_offers',
  visibility visibility_enum NOT NULL DEFAULT 'public',
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### `capabilities`
```sql
CREATE TABLE capabilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL
);
```

### `profile_capabilities`
```sql
CREATE TABLE profile_capabilities (
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  capability_id UUID NOT NULL REFERENCES capabilities(id) ON DELETE CASCADE,
  claim_text TEXT,
  sort_order INT DEFAULT 0,
  PRIMARY KEY (profile_id, capability_id)
);
```

### `evidence`
```sql
CREATE TABLE evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_type target_type_enum NOT NULL DEFAULT 'profile',
  target_id UUID,
  evidence_type evidence_type_enum NOT NULL,
  title TEXT NOT NULL,
  source_url TEXT,
  storage_path TEXT,
  issued_at DATE,
  expires_at DATE,
  visibility visibility_enum NOT NULL DEFAULT 'public',
  status evidence_status_enum NOT NULL DEFAULT 'self_added',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 5. B2B Extension Tables

### `business_details`
```sql
CREATE TABLE business_details (
  profile_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  legal_name TEXT NOT NULL,
  business_type TEXT NOT NULL,
  year_started INT,
  employee_band TEXT,
  gstin_last4 TEXT,
  website TEXT
);
```

### `business_capabilities`
```sql
CREATE TABLE business_capabilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  capability_type business_capability_enum NOT NULL,
  label TEXT NOT NULL
);
```

### `business_products`
```sql
CREATE TABLE business_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  moq NUMERIC DEFAULT 1,
  capacity_text TEXT,
  lead_time_text TEXT,
  private_label BOOLEAN DEFAULT false,
  export_supported BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```
