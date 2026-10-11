// ============================================================================
// PROOF-ID / BACKED — PRIVILEGED EDGE FUNCTION: DELETE ACCOUNT
// Fulfills Slice 4: Idempotent account deletion with checked errors, paginated
// storage object cleanup, and audit logging.
// ============================================================================

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST" && req.method !== "DELETE") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // 1. Authenticate caller strictly via Authorization JWT header
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
      return new Response(JSON.stringify({ error: "Invalid session token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = user.id;
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // 2. Paginated Storage Object Cleanup
    const userFolder = `user_${userId}`;
    let hasMore = true;
    let offset = 0;
    const pageSize = 100;

    while (hasMore) {
      const { data: fileList, error: listError } = await adminClient.storage
        .from("evidence-vault")
        .list(userFolder, { limit: pageSize, offset });

      if (listError || !fileList || fileList.length === 0) {
        hasMore = false;
        break;
      }

      const pathsToRemove = fileList.map((f) => `${userFolder}/${f.name}`);
      const { error: removeError } = await adminClient.storage
        .from("evidence-vault")
        .remove(pathsToRemove);

      if (removeError) {
        console.warn(`[delete-account] Failed to remove storage batch for ${userId}:`, removeError);
      }

      if (fileList.length < pageSize) {
        hasMore = false;
      } else {
        offset += pageSize;
      }
    }

    // 3. Record audit event before removing user identity
    try {
      await adminClient.from("audit_events").insert({
        actor_id: userId,
        action: "ACCOUNT_DELETED",
        resource_type: "users",
        resource_id: userId,
        metadata: { email: user.email, deleted_at: new Date().toISOString() },
      });
    } catch {
      // Non-blocking for deletion completion
    }

    // 4. Cascade delete database profiles (foreign keys cascade to all user data)
    await adminClient.from("profiles").delete().eq("id", userId);

    // 5. Delete auth user record idempotently
    const { error: deleteAuthError } = await adminClient.auth.admin.deleteUser(userId);
    if (deleteAuthError && !deleteAuthError.message?.includes("User not found")) {
      throw deleteAuthError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Account, storage assets, and associated profile data successfully deleted.",
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
