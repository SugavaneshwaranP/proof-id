// ============================================================================
// BACKED / PROOF-ID — PRODUCTION READINESS & SMOKE TEST RUNNER
// Zero-dependency runner using native Node.js fetch (Node 18, 20, 22+)
// ============================================================================

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://yvzfmfpzhanwlxstdmkk.supabase.co";
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2emZtZnB6aGFud2x4c3RkbWtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0NjA5NDQsImV4cCI6MjEwNzAzNjk0NH0.u8mjBdxSxTULU_xVdmCUFF6lcAFC6_bWFPaIaWQeRcw";

const headers = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json",
};

async function runSmokeTests() {
  console.log("==========================================================");
  console.log("PROOF-ID / BACKED — PRODUCTION READINESS AUDIT");
  console.log(`Target: ${SUPABASE_URL}`);
  console.log("==========================================================\n");

  let passed = 0;
  let total = 0;

  async function check(name, fn) {
    total++;
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}: ${err.message}`);
    }
  }

  // 1. Slug availability RPC test
  await check("RPC: check_slug_availability responds correctly", async () => {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/check_slug_availability`, {
      method: "POST",
      headers,
      body: JSON.stringify({ target_slug: "alexrivera" }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`HTTP ${res.status}: ${err}`);
    }
    const val = await res.json();
    if (typeof val !== "boolean") {
      throw new Error(`Expected boolean response, got: ${JSON.stringify(val)}`);
    }
  });

  // 2. Search profiles RPC test
  await check("RPC: search_profiles returns table format", async () => {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/search_profiles`, {
      method: "POST",
      headers,
      body: JSON.stringify({ p_query: "engineer" }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`HTTP ${res.status}: ${err}`);
    }
    const val = await res.json();
    if (!Array.isArray(val)) {
      throw new Error(`Expected array format, got: ${JSON.stringify(val)}`);
    }
  });

  // 3. Public Profiles View Allow-List Test
  await check("View: public_profiles_view accessible to anon", async () => {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/public_profiles_view?select=slug,full_name,headline&limit=5`,
      { headers }
    );

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`HTTP ${res.status}: ${err}`);
    }
    const val = await res.json();
    if (!Array.isArray(val)) {
      throw new Error(`Expected array format, got: ${JSON.stringify(val)}`);
    }
  });

  // 4. Private Storage Bucket Isolation Test
  await check("Storage: Direct unauthenticated file listing in evidence-vault is denied", async () => {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/list/evidence-vault`, {
      method: "POST",
      headers,
      body: JSON.stringify({ prefix: "", limit: 10 }),
    });

    // If bucket doesn't exist yet or is forbidden, that's expected before migration
    if (res.ok) {
      const val = await res.json();
      if (Array.isArray(val) && val.length > 0) {
        throw new Error("SECURITY VIOLATION: Anonymous caller was able to view private vault contents!");
      }
    }
  });

  // 5. Audit Log Privacy Test
  await check("RLS: audit_events table is forbidden to anonymous callers", async () => {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/audit_events?limit=1`, {
      headers,
    });

    if (res.ok) {
      const val = await res.json();
      if (Array.isArray(val) && val.length > 0) {
        throw new Error("SECURITY VIOLATION: Anonymous caller was able to read audit logs!");
      }
    }
  });

  console.log("\n==========================================================");
  console.log(`AUDIT COMPLETE: ${passed}/${total} checks passed.`);
  if (passed < total) {
    console.log("NOTE: If checks failed with 404 or missing relation, ensure you have executed");
    console.log("supabase/migrations/combined_all_migrations.sql in the Supabase SQL Editor.");
  }
  console.log("==========================================================");
}

runSmokeTests().catch(console.error);
