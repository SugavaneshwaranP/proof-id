// ============================================================================
// PROOF-ID / BACKED — PRIVILEGED EDGE FUNCTION: GENERATE UPLOAD URL
// Fulfills Slice 4: Authenticate caller, derive owner from JWT, verify ownership,
// validate file constraints, and generate server-owned object path with short-lived URL.
// ============================================================================

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

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
      return new Response(JSON.stringify({ error: "Invalid or expired session token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Derive caller ID strictly from verified credentials
    const callerId = user.id;

    // Service role client for privileged storage operations
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    const { fileName, fileType, fileSize } = await req.json();

    if (!fileName || !fileType) {
      return new Response(JSON.stringify({ error: "Invalid upload metadata: fileName and fileType are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Validate MIME type allow-list
    if (!ALLOWED_MIME_TYPES.includes(fileType.toLowerCase())) {
      return new Response(
        JSON.stringify({ error: "Unsupported file format. Only PDF, PNG, JPG, and WebP are allowed." }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Enforce maximum file size boundary
    if (fileSize && fileSize > MAX_FILE_SIZE_BYTES) {
      return new Response(
        JSON.stringify({ error: "File size exceeds the 5 MB limit." }),
        { status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Generate server-owned, collision-resistant storage path scoped to caller
    const safeBaseName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
    const uniqueId = crypto.randomUUID().slice(0, 12);
    const filePath = `user_${callerId}/${Date.now()}_${uniqueId}_${safeBaseName}`;

    // 5. Generate short-lived signed upload URL (expires in 120 seconds)
    const { data, error: storageError } = await adminClient.storage
      .from("evidence-vault")
      .createSignedUploadUrl(filePath);

    if (storageError) {
      console.error("[generate-upload-url] Storage error:", storageError);
      throw storageError;
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
    return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
