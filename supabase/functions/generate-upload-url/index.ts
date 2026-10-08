import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ALLOWED_MIME_TYPES = ["application/pdf", "image/png", "image/jpeg", "image/webp"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { fileName, fileType, fileSize, userId } = await req.json();

    if (!fileName || !fileType || !userId) {
      return new Response(JSON.stringify({ error: "Invalid upload metadata" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!ALLOWED_MIME_TYPES.includes(fileType)) {
      return new Response(JSON.stringify({ error: "File format not supported. Only PDF, PNG, and JPG files are allowed." }), {
        status: 422,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (fileSize && fileSize > MAX_FILE_SIZE_BYTES) {
      return new Response(JSON.stringify({ error: "File size exceeds maximum 5 MB limit." }), {
        status: 413,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const filePath = `user_${userId}/${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

    const { data, error } = await supabase.storage
      .from("evidence-vault")
      .createSignedUploadUrl(filePath);

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({
        signedUrl: data.signedUrl,
        path: filePath,
        token: data.token,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
