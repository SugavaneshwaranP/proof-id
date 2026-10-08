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

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid session token" }), { status: 401, headers: corsHeaders });
    }

    const userId = user.id;

    // 1. Delete files from storage bucket
    const { data: files } = await supabase.storage.from("evidence-vault").list(`user_${userId}`);
    if (files && files.length > 0) {
      const pathsToDelete = files.map((f) => `user_${userId}/${f.name}`);
      await supabase.storage.from("evidence-vault").remove(pathsToDelete);
    }

    // 2. Cascade delete database records
    await supabase.from("profiles").delete().eq("id", userId);

    // 3. Delete auth user record
    const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(userId);
    if (deleteAuthError) {
      throw deleteAuthError;
    }

    return new Response(
      JSON.stringify({ success: true, message: "Account and associated data completely deleted." }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
