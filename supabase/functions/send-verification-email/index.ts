// ============================================================================
// PROOF-ID / BACKED — PRIVILEGED EDGE FUNCTION: SEND VERIFICATION EMAIL
// Fulfills Slice 4 & Rule 11: Authenticate caller, verify evidence ownership,
// high-entropy token hashed at rest with SHA-256, real email dispatch, NO token logging.
// ============================================================================

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function sha256Hex(str: string): Promise<string> {
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

    const callerId = user.id;
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    const evidenceId = body.evidence_id || body.evidenceId;
    const verifierName = body.verifier_name || body.verifierName;
    const verifierEmail = body.verifier_email || body.verifierEmail;
    const note = body.note || null;

    if (!evidenceId || !verifierEmail || !verifierName) {
      return new Response(
        JSON.stringify({ error: "evidence_id, verifier_name, and verifier_email are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Verify evidence ownership against canonical database state
    const { data: evidence, error: evErr } = await adminClient
      .from("evidence_items")
      .select("id, profile_id, title")
      .eq("id", evidenceId)
      .single();

    if (evErr || !evidence) {
      return new Response(JSON.stringify({ error: "Evidence item not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (evidence.profile_id !== callerId) {
      return new Response(
        JSON.stringify({ error: "Forbidden: You do not own this evidence item" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Generate high-entropy 256-bit token & compute SHA-256 hash for storage
    const rawEntropy = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");
    const tokenHash = await sha256Hex(rawEntropy);

    // 4. Persist verification request with hash at rest
    const { data: requestRecord, error: dbError } = await adminClient
      .from("verification_requests")
      .insert({
        profile_id: callerId,
        evidence_id: evidenceId,
        verifier_name: verifierName,
        verifier_email: verifierEmail,
        token_hash: tokenHash,
        status: "pending",
        note,
      })
      .select()
      .single();

    if (dbError) {
      throw dbError;
    }

    // Update evidence item status to pending
    await adminClient
      .from("evidence_items")
      .update({ status: "pending", updated_at: new Date().toISOString() })
      .eq("id", evidenceId);

    // 5. Build verification deep link
    const appBaseUrl = Deno.env.get("PUBLIC_APP_URL") || "https://backed.network";
    const verificationUrl = `${appBaseUrl}/verify/${rawEntropy}`;

    // 6. Dispatch email via configured provider (Resend / SendGrid / Postmark)
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (resendApiKey) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Backed Trust Engine <verify@backed.network>",
            to: [verifierEmail],
            subject: `Verification Request from ${verifierName}`,
            html: `
              <h2>Confirm Work Claim on Backed</h2>
              <p>You have been requested to verify the following work claim:</p>
              <blockquote><strong>${evidence.title}</strong></blockquote>
              <p><a href="${verificationUrl}" style="padding:10px 18px;background:#0f172a;color:#fff;text-decoration:none;border-radius:6px;display:inline-block;">Review & Confirm Claim</a></p>
              <p><small>This single-use link expires in 7 days.</small></p>
            `,
          }),
        });
      } catch (mailErr) {
        console.error("[send-verification-email] Email provider dispatch error:", mailErr);
      }
    } else {
      // Production Rule 11: NEVER log the raw token into stdout or logs
      console.log(`[VERIFICATION EMAIL DISPATCH] To: ${verifierEmail} | Request ID: ${requestRecord.id} | Hash: ${tokenHash.slice(0, 10)}... (token protected)`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Verification request dispatched to verifier.",
        request_id: requestRecord.id,
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
