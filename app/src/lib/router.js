// ============================================================================
// PROOF-ID / BACKED — CLIENT ROUTER & AUTH ROUTE GUARDS
// Implements real HTML5 History routing, deep links, refresh, back/forward,
// dynamic slugs (/:slug), and protected route redirects (Slice 1 requirement).
// ============================================================================

import { authService } from "./authService";

const PROTECTED_PAGES = [
  "dashboard",
  "dashboard-profile",
  "dashboard-projects",
  "dashboard-products",
  "dashboard-evidence",
  "dashboard-verifications",
  "dashboard-inbox",
  "dashboard-insights",
  "dashboard-settings",
  "admin-reports",
];

const ONBOARDING_PAGES = [
  "onboarding-type",
  "onboarding-slug",
  "onboarding-basics",
  "onboarding-basics-business",
  "onboarding-capabilities",
  "onboarding-proof",
  "onboarding-preview",
  "onboarding-published",
];

export function parseRoute(pathname = window.location.pathname, search = window.location.search) {
  const cleanPath = pathname.replace(/\/+$/, "") || "/";
  const params = new URLSearchParams(search);

  // Home
  if (cleanPath === "/" || cleanPath === "") {
    return { page: "home", slug: null, params };
  }

  // Exact static routes
  const staticRoutes = {
    "/login": "login",
    "/signup": "signup",
    "/create": "signup",
    "/products": "products",
    "/about": "about",
    "/contact": "contact",
    "/privacy": "privacy",
    "/terms": "terms",
    "/faq": "faq",
    "/discover": "discover",
    "/explorer": "explorer",
    "/confirm-claim": "confirm-claim",
    "/public-contact": "public-contact",
  };

  if (staticRoutes[cleanPath]) {
    return { page: staticRoutes[cleanPath], slug: null, params };
  }

  // Dashboard protected routes
  if (cleanPath === "/dashboard") return { page: "dashboard", slug: null, params };
  if (cleanPath === "/dashboard/profile" || cleanPath === "/dashboard-profile") return { page: "dashboard-profile", slug: null, params };
  if (cleanPath === "/dashboard/projects" || cleanPath === "/dashboard-projects") return { page: "dashboard-projects", slug: null, params };
  if (cleanPath === "/dashboard/products" || cleanPath === "/dashboard-products") return { page: "dashboard-products", slug: null, params };
  if (cleanPath === "/dashboard/evidence" || cleanPath === "/dashboard-evidence") return { page: "dashboard-evidence", slug: null, params };
  if (cleanPath === "/dashboard/verifications" || cleanPath === "/dashboard-verifications") return { page: "dashboard-verifications", slug: null, params };
  if (cleanPath === "/dashboard/inbox" || cleanPath === "/dashboard-inbox") return { page: "dashboard-inbox", slug: null, params };
  if (cleanPath === "/dashboard/insights" || cleanPath === "/dashboard-insights") return { page: "dashboard-insights", slug: null, params };
  if (cleanPath === "/dashboard/settings" || cleanPath === "/dashboard-settings") return { page: "dashboard-settings", slug: null, params };
  if (cleanPath === "/admin" || cleanPath === "/admin/reports" || cleanPath === "/admin-reports") return { page: "admin-reports", slug: null, params };

  // Onboarding routes
  if (cleanPath === "/onboarding" || cleanPath === "/onboarding/type" || cleanPath === "/onboarding-type") return { page: "onboarding-type", slug: null, params };
  if (cleanPath === "/onboarding/slug" || cleanPath === "/onboarding-slug") return { page: "onboarding-slug", slug: null, params };
  if (cleanPath === "/onboarding/basics" || cleanPath === "/onboarding-basics") return { page: "onboarding-basics", slug: null, params };
  if (cleanPath === "/onboarding/basics-business" || cleanPath === "/onboarding-basics-business") return { page: "onboarding-basics-business", slug: null, params };
  if (cleanPath === "/onboarding/capabilities" || cleanPath === "/onboarding-capabilities") return { page: "onboarding-capabilities", slug: null, params };
  if (cleanPath === "/onboarding/proof" || cleanPath === "/onboarding-proof") return { page: "onboarding-proof", slug: null, params };
  if (cleanPath === "/onboarding/preview" || cleanPath === "/onboarding-preview") return { page: "onboarding-preview", slug: null, params };
  if (cleanPath === "/onboarding/published" || cleanPath === "/onboarding-published") return { page: "onboarding-published", slug: null, params };

  // Verification deep link (/verify/:token)
  if (cleanPath.startsWith("/verify/")) {
    const token = cleanPath.replace("/verify/", "");
    params.set("token", token);
    return { page: "confirm-claim", slug: null, token, params };
  }

  // Business Spec Profile deep link (/business/:slug)
  if (cleanPath.startsWith("/business/")) {
    const slug = cleanPath.replace("/business/", "");
    return { page: "public-business-profile", slug, params };
  }

  // Dynamic Profile Slug (/:slug, e.g. /alexrivera or /apex-dynamics)
  const segments = cleanPath.split("/").filter(Boolean);
  if (segments.length === 1) {
    const slugCandidate = segments[0];
    if (slugCandidate === "apex-dynamics") {
      return { page: "public-business-profile", slug: slugCandidate, params };
    }
    return { page: "public-profile", slug: slugCandidate, params };
  }

  // Fallback 404
  return { page: "404", slug: null, params };
}

export function getPathForPage(page, slug = null) {
  if (page === "home") return "/";
  if (page === "public-profile") return slug ? `/${slug}` : "/alexrivera";
  if (page === "public-business-profile") return slug ? `/business/${slug}` : "/business/apex-dynamics";
  if (page.startsWith("dashboard-")) return `/dashboard/${page.replace("dashboard-", "")}`;
  if (page.startsWith("onboarding-")) return `/onboarding/${page.replace("onboarding-", "")}`;
  if (page === "admin-reports") return "/admin/reports";
  return `/${page}`;
}

export function checkAuthGuard(targetPage) {
  if (!PROTECTED_PAGES.includes(targetPage)) {
    return { allowed: true };
  }

  const currentUser = authService.getCurrentUser();
  if (!currentUser) {
    return {
      allowed: false,
      redirectPage: "login",
      reason: "Authentication required to access dashboard",
    };
  }

  return { allowed: true };
}
