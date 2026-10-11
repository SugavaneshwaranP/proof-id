// ============================================================================
// PROOF-ID / BACKED — PRIVILEGED EDGE FUNCTION: AGGREGATE ANALYTICS
// Fulfills Slice 4: Trusted scheduled/secret-only invocation, idempotent aggregation,
// zero arbitrary user access.
// ============================================================================

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const cronSecret = Deno.env.get("CRON_SECRET");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;

    // 1. Authorize secret-only invocation
    const providedSecret = req.headers.get("x-cron-secret");
    const authHeader = req.headers.get("Authorization");

    const isAuthorized =
      (cronSecret && providedSecret === cronSecret) ||
      (authHeader && authHeader === `Bearer ${serviceRoleKey}`);

    if (!isAuthorized) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Scheduled cron or service secret required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const todayStr = new Date().toISOString().split("T")[0];

    // 2. Query published profiles for daily aggregation
    const { data: profiles, error: profErr } = await adminClient
      .from("profiles")
      .select("id")
      .eq("is_published", true);

    if (profErr) {
      throw profErr;
    }

    let aggregatedCount = 0;

    if (profiles && profiles.length > 0) {
      for (const p of profiles) {
        // Query daily messages received
        const { count: msgCount } = await adminClient
          .from("contact_requests")
          .select("*", { count: "exact", head: true })
          .eq("profile_id", p.id)
          .gte("created_at", `${todayStr}T00:00:00Z`);

        // Idempotently upsert aggregated record
        await adminClient.from("daily_analytics").upsert(
          {
            profile_id: p.id,
            log_date: todayStr,
            messages_received: msgCount || 0,
          },
          { onConflict: "profile_id,log_date" }
        );

        aggregatedCount++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Analytics daily rollup complete",
        profiles_processed: aggregatedCount,
        date: todayStr,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
