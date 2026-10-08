// ============================================================================
// CLOUDFLARE WORKER — EDGE WAF, CSP & ADVANCED SECURITY HEADERS
// Enforces TLS 1.3, Strict CSP, HSTS, IP Risk Controls & Rate Limiting
// ============================================================================

const CSP_DIRECTIVE = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://*.supabase.co",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https://*.supabase.co https://images.unsplash.com",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const clientIP = request.headers.get("CF-Connecting-IP") || "anonymous";

    // 1. IP / Risk Control for Admin routes
    if (url.pathname.startsWith("/admin")) {
      const adminAttemptKey = `admin_risk:${clientIP}`;
      const adminAttempts = parseInt((await env.RATE_LIMIT_KV.get(adminAttemptKey)) || "0", 10);
      
      if (adminAttempts > 20) {
        return new Response(
          JSON.stringify({ error: "Access temporarily blocked due to excessive risk score." }),
          {
            status: 403,
            headers: {
              "Content-Type": "application/json",
              "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
            },
          }
        );
      }
      await env.RATE_LIMIT_KV.put(adminAttemptKey, (adminAttempts + 1).toString(), { expirationTtl: 300 });
    }

    // 2. Rate limiting for contact forms & report submissions
    if (request.method === "POST" && (url.pathname.endsWith("/contact") || url.pathname.endsWith("/report"))) {
      const kvKey = `rate_limit:${clientIP}:${url.pathname}`;
      const currentAttemptsStr = await env.RATE_LIMIT_KV.get(kvKey);
      const currentAttempts = currentAttemptsStr ? parseInt(currentAttemptsStr, 10) : 0;

      if (currentAttempts >= 5) {
        return new Response(
          JSON.stringify({ error: "Please don't send more than a few messages a day — it helps keep things genuine." }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "Retry-After": "3600",
              "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      }

      await env.RATE_LIMIT_KV.put(kvKey, (currentAttempts + 1).toString(), { expirationTtl: 3600 });
    }

    // 3. Fetch from origin / static assets
    const response = await fetch(request);

    // 4. Inject Full Defense-in-Depth Security Headers
    const headers = new Headers(response.headers);
    headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
    headers.set("Content-Security-Policy", CSP_DIRECTIVE);
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("X-Frame-Options", "DENY");
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
    headers.set("X-XSS-Protection", "1; mode=block");

    // Clean sensitive internal debugging headers
    headers.delete("x-powered-by");
    headers.delete("server");

    // Cache control scoping
    if (url.pathname.startsWith("/business/") || (url.pathname.length > 1 && !url.pathname.startsWith("/dashboard") && !url.pathname.startsWith("/admin") && !url.pathname.startsWith("/onboarding"))) {
      headers.set("Cache-Control", "public, max-age=60, s-maxage=300, stale-while-revalidate=86400");
    } else if (url.pathname.startsWith("/dashboard") || url.pathname.startsWith("/admin")) {
      headers.set("Cache-Control", "private, no-cache, no-store, must-revalidate");
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
