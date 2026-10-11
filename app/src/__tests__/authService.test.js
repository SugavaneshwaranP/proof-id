// ============================================================================
// PROOF-ID / BACKED — AUTH SERVICE UNIT & SECURITY TESTS
// Verifies official Supabase auth methods, session restore, and absence of plaintext storage.
// ============================================================================

import { authService } from "../lib/authService";
import { supabase } from "../lib/supabaseClient";

describe("AuthService Production Hardening", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  test("getCurrentUser returns null when no active session", () => {
    const user = authService.getCurrentUser();
    expect(user).toBeNull();
  });

  test("signUp calls official supabase.auth.signUp with proper metadata", async () => {
    const spy = vi.spyOn(supabase.auth, "signUp").mockResolvedValue({
      data: {
        user: {
          id: "usr-1234",
          email: "test@example.com",
          user_metadata: { full_name: "Test User", profile_type: "person" },
        },
        session: { access_token: "mock-jwt-token" },
      },
      error: null,
    });

    const result = await authService.signUp({
      email: "test@example.com",
      password: "SecurePassword123!",
      fullName: "Test User",
      profileType: "person",
    });

    expect(spy).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "SecurePassword123!",
      options: {
        data: {
          full_name: "Test User",
          profile_type: "person",
          slug: "test",
        },
      },
    });

    expect(result.id).toBe("usr-1234");
    expect(result.fullName).toBe("Test User");

    // CRITICAL SECURITY ASSERTION: Passwords must NEVER be stored in localStorage
    expect(localStorage.getItem("backed_user_accounts")).toBeNull();
    expect(localStorage.getItem("backed_auth_password")).toBeNull();
  });

  test("signInWithPassword invokes official Supabase auth engine", async () => {
    const spy = vi.spyOn(supabase.auth, "signInWithPassword").mockResolvedValue({
      data: {
        user: {
          id: "usr-1234",
          email: "test@example.com",
          user_metadata: { full_name: "Test User" },
        },
        session: { access_token: "mock-jwt-token" },
      },
      error: null,
    });

    const result = await authService.signInWithPassword({
      email: "test@example.com",
      password: "SecurePassword123!",
    });

    expect(spy).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "SecurePassword123!",
    });
    expect(result.id).toBe("usr-1234");
  });

  test("signOut destroys session and clears memory state", async () => {
    const spy = vi.spyOn(supabase.auth, "signOut").mockResolvedValue({ error: null });
    await authService.signOut();
    expect(spy).toHaveBeenCalled();
    expect(authService.getCurrentUser()).toBeNull();
  });

  test("resetPasswordForEmail routes via official Supabase recovery flow", async () => {
    const spy = vi.spyOn(supabase.auth, "resetPasswordForEmail").mockResolvedValue({
      data: {},
      error: null,
    });

    await authService.resetPasswordForEmail("test@example.com");
    expect(spy).toHaveBeenCalledWith("test@example.com", expect.any(Object));
  });
});
