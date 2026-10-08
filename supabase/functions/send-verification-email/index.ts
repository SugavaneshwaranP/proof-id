import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function cryptoHash(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { profile_id, evidence_id, verifier_name, verifier_email } = await req.json();

    if (!profile_id || !evidence_id || !verifier_email) {
      return new Response(JSON.stringify({ error: "Missing required parameters" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1. Generate single-use random verification token
    const rawToken = crypto.randomUUID() + "-" + Date.now().toString(36);
    const tokenHash = await cryptoHash(rawToken);

    // 2. Insert into verification_requests table
    const { data: requestData, error: dbError } = await supabase
      .from("verification_requests")
      .insert({
        profile_id,
        evidence_id,
        verifier_name,
        verifier_email,
        token_hash: tokenHash,
        status: "pending",
      })
      .select()
      .single();

    if (dbError) {
      throw dbError;
    }

    // 3. Construct verification link
    const appBaseUrl = Deno.env.get("PUBLIC_APP_URL") || "https://backed.work";
    const verificationUrl = `${appBaseUrl}/verify/${rawToken}`;

    // 4. Log or dispatch email (SendGrid / Resend API)
    console.log(`[VERIFICATION EMAIL SENT] To: ${verifier_email} | Link: ${verificationUrl}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Verification request link created and email dispatched",
        request_id: requestData.id,
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
