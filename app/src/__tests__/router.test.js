// ============================================================================
// PROOF-ID / BACKED — ROUTER & AUTH ROUTE GUARD UNIT TESTS
// Verifies URL parsing, dynamic slugs, deep links, and route protection.
// ============================================================================

import { parseRoute, getPathForPage, checkAuthGuard } from "../lib/router";
import { authService } from "../lib/authService";

describe("Client Router & Route Guards", () => {
  test("parses root path as home", () => {
    const route = parseRoute("/");
    expect(route.page).toBe("home");
    expect(route.slug).toBeNull();
  });

  test("parses static pages cleanly", () => {
    expect(parseRoute("/login").page).toBe("login");
    expect(parseRoute("/signup").page).toBe("signup");
    expect(parseRoute("/products").page).toBe("products");
    expect(parseRoute("/faq").page).toBe("faq");
  });

  test("parses dynamic person profile slug", () => {
    const route = parseRoute("/alexrivera");
    expect(route.page).toBe("public-profile");
    expect(route.slug).toBe("alexrivera");
  });

  test("parses business profile slug", () => {
    const route = parseRoute("/business/apex-dynamics");
    expect(route.page).toBe("public-business-profile");
    expect(route.slug).toBe("apex-dynamics");
  });

  test("parses verification token deep link", () => {
    const route = parseRoute("/verify/token-crypto-9921");
    expect(route.page).toBe("confirm-claim");
    expect(route.token).toBe("token-crypto-9921");
  });

  test("parses dashboard protected subroutes", () => {
    expect(parseRoute("/dashboard").page).toBe("dashboard");
    expect(parseRoute("/dashboard/profile").page).toBe("dashboard-profile");
    expect(parseRoute("/dashboard/projects").page).toBe("dashboard-projects");
    expect(parseRoute("/dashboard/evidence").page).toBe("dashboard-evidence");
    expect(parseRoute("/dashboard/inbox").page).toBe("dashboard-inbox");
  });

  test("checkAuthGuard denies unauthenticated access to dashboard", () => {
    vi.spyOn(authService, "getCurrentUser").mockReturnValue(null);
    const guard = checkAuthGuard("dashboard-profile");
    expect(guard.allowed).toBe(false);
    expect(guard.redirectPage).toBe("login");
  });

  test("checkAuthGuard permits authenticated user to access dashboard", () => {
    vi.spyOn(authService, "getCurrentUser").mockReturnValue({ id: "usr-1", slug: "alexrivera" });
    const guard = checkAuthGuard("dashboard-profile");
    expect(guard.allowed).toBe(true);
  });

  test("getPathForPage returns canonical URL paths", () => {
    expect(getPathForPage("home")).toBe("/");
    expect(getPathForPage("public-profile", "johndoe")).toBe("/johndoe");
    expect(getPathForPage("public-business-profile", "acme-corp")).toBe("/business/acme-corp");
    expect(getPathForPage("dashboard-evidence")).toBe("/dashboard/evidence");
  });
});
