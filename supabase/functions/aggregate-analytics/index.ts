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

    const todayStr = new Date().toISOString().split("T")[0];

    // Query active profiles
    const { data: profiles } = await supabase.from("profiles").select("id").eq("is_published", true);

    if (profiles && profiles.length > 0) {
      for (const p of profiles) {
        // Fetch count of contact messages received today
        const { count: msgCount } = await supabase
          .from("contact_requests")
          .select("*", { count: "exact", head: true })
          .eq("profile_id", p.id)
          .gte("created_at", todayStr);

        await supabase.from("daily_analytics").upsert(
          {
            profile_id: p.id,
            log_date: todayStr,
            messages_received: msgCount || 0,
          },
          { onConflict: "profile_id,log_date" }
        );
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: "Analytics daily rollup complete" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
