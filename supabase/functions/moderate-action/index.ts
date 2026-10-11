// ============================================================================
// PROOF-ID / BACKED — PRIVILEGED EDGE FUNCTION: MODERATE ACTION
// Fulfills Slice 4: Authenticate, verify admin role, derive target from canonical
// report row, allow-list actions, and record immutable audit logs.
// ============================================================================

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ALLOWED_ACTIONS = ["dismiss", "warn", "takedown"] as const;
type ModerationAction = typeof ALLOWED_ACTIONS[number];

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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // 1. Authenticate caller credentials via Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Authentication required" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid or expired session token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Authorize admin role (never trust body-supplied role)
    const role = user.app_metadata?.role || user.user_metadata?.role;
    if (role !== "admin") {
      return new Response(JSON.stringify({ error: "Forbidden: Admin privileges required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Privileged service client for execution
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    const { report_id, action } = await req.json();

    if (!report_id || !action) {
      return new Response(JSON.stringify({ error: "Missing report_id or action" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!ALLOWED_ACTIONS.includes(action as ModerationAction)) {
      return new Response(JSON.stringify({ error: `Invalid action. Allowed: ${ALLOWED_ACTIONS.join(", ")}` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Derive target profile strictly from canonical database report row
    const { data: report, error: reportErr } = await adminClient
      .from("reports")
      .select("id, target_profile_id, status")
      .eq("id", report_id)
      .single();

    if (reportErr || !report) {
      return new Response(JSON.stringify({ error: "Report not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const targetProfileId = report.target_profile_id;
    const nowIso = new Date().toISOString();

    // 4. Execute atomic state transition
    if (action === "dismiss") {
      await adminClient
        .from("reports")
        .update({ status: "dismissed", resolved_at: nowIso })
        .eq("id", report_id);
    } else if (action === "warn") {
      await adminClient
        .from("reports")
        .update({ status: "warned", resolved_at: nowIso })
        .eq("id", report_id);
    } else if (action === "takedown") {
      await adminClient
        .from("reports")
        .update({ status: "taken_down", resolved_at: nowIso })
        .eq("id", report_id);

      // Unpublish target profile via privileged service role
      await adminClient
        .from("profiles")
        .update({ is_published: false, updated_at: nowIso })
        .eq("id", targetProfileId);
    }

    // 5. Append immutable audit log event
    await adminClient.from("audit_events").insert({
      actor_id: user.id,
      action: `MODERATE_${action.toUpperCase()}`,
      resource_type: "reports",
      resource_id: report_id,
      metadata: {
        target_profile_id: targetProfileId,
        moderator_id: user.id,
        action,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        report_id,
        target_profile_id: targetProfileId,
        action_executed: action,
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
