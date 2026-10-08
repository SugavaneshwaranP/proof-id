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

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { report_id, target_profile_id, action } = await req.json();

    if (!report_id || !action) {
      return new Response(JSON.stringify({ error: "Missing report_id or action" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "dismiss") {
      await supabase
        .from("reports")
        .update({ status: "dismissed", resolved_at: new Date().toISOString() })
        .eq("id", report_id);
    } else if (action === "warn") {
      await supabase
        .from("reports")
        .update({ status: "warned", resolved_at: new Date().toISOString() })
        .eq("id", report_id);
      
      console.log(`[MODERATION WARNING SENT] Target Profile: ${target_profile_id}`);
    } else if (action === "takedown") {
      await supabase
        .from("reports")
        .update({ status: "taken_down", resolved_at: new Date().toISOString() })
        .eq("id", report_id);

      // Unpublish target profile via privileged service role
      await supabase
        .from("profiles")
        .update({ is_published: false })
        .eq("id", target_profile_id);

      console.log(`[MODERATION TAKEDOWN EXECUTED] Profile ${target_profile_id} unpublished`);
    } else {
      return new Response(JSON.stringify({ error: "Invalid action" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ success: true, action_executed: action }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
