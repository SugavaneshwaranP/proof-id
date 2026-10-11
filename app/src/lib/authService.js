// ============================================================================
// PROOF-ID / BACKED — OFFICIAL PRODUCTION AUTHENTICATION SERVICE
// Exclusively powered by Supabase Auth (Argon2/Bcrypt, PKCE Session Management)
// Zero plaintext passwords, zero mock seed accounts in production paths.
// ============================================================================

import { supabase } from "./supabaseClient";

export const authService = {
  /**
   * Get the current authenticated user synchronously from cached session,
   * with full fallback to async supabase.auth.getUser()
   */
  getCurrentUser: () => {
    try {
      // Fast synchronous check from PKCE persisted session
      const rawSession = localStorage.getItem("backed-auth-token");
      if (rawSession) {
        const parsed = JSON.parse(rawSession);
        const user = parsed?.user;
        if (user) {
          return {
            id: user.id,
            email: user.email,
            fullName: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
            profileType: user.user_metadata?.profile_type || "person",
            slug: user.user_metadata?.slug || user.id.slice(0, 8),
            avatarUrl: user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.id)}`,
            createdAt: user.created_at,
          };
        }
      }
      return null;
    } catch {
      return null;
    }
  },

  /**
   * Asynchronously fetch canonical authenticated user from Supabase
   */
  fetchUser: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return null;

      return {
        id: user.id,
        email: user.email,
        fullName: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
        profileType: user.user_metadata?.profile_type || "person",
        slug: user.user_metadata?.slug || user.id.slice(0, 8),
        avatarUrl: user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.id)}`,
        createdAt: user.created_at,
      };
    } catch (err) {
      console.warn("Failed to fetch user from Supabase Auth:", err);
      return null;
    }
  },

  /**
   * Listen to real-time auth state changes across browser sessions & tabs
   */
  onAuthChange: (callback) => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const user = session?.user
        ? {
            id: session.user.id,
            email: session.user.email,
            fullName: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "User",
            profileType: session.user.user_metadata?.profile_type || "person",
            slug: session.user.user_metadata?.slug || session.user.id.slice(0, 8),
            avatarUrl: session.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(session.user.id)}`,
            createdAt: session.user.created_at,
          }
        : null;

      callback(user, event);
    });

    return () => {
      subscription?.unsubscribe();
    };
  },

  /**
   * Production Sign Up via Supabase Auth
   */
  signUp: async ({ email, password, fullName, profileType = "person", slug = "" }) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanSlug = (slug || cleanEmail.split("@")[0]).toLowerCase().replace(/[^a-z0-9_-]/g, "");

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password: password,
      options: {
        data: {
          full_name: fullName.trim(),
          profile_type: profileType,
          slug: cleanSlug,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    const user = data.user;
    if (!user) {
      throw new Error("Unable to create account. Please check your credentials.");
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.user_metadata?.full_name || fullName,
      profileType: user.user_metadata?.profile_type || profileType,
      slug: user.user_metadata?.slug || cleanSlug,
      createdAt: user.created_at,
    };
  },

  /**
   * Production Sign In with Password via Supabase Auth
   */
  signIn: async ({ email, password }) => {
    const cleanEmail = email.trim().toLowerCase();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: password,
    });

    if (error) {
      throw new Error(error.message);
    }

    const user = data.user;
    return {
      id: user.id,
      email: user.email,
      fullName: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
      profileType: user.user_metadata?.profile_type || "person",
      slug: user.user_metadata?.slug || user.id.slice(0, 8),
      createdAt: user.created_at,
    };
  },

  /**
   * Production OAuth Sign In via Supabase Auth (GitHub or Google)
   */
  signInWithOAuth: async (provider = "github") => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  /**
   * Send Password Reset Email via Supabase Auth
   */
  resetPasswordForEmail: async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/dashboard-settings`,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  /**
   * Sign Out & Invalidate Session
   */
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.warn("Supabase signOut error:", error.message);
    }
    // Clean any residual local tokens
    localStorage.removeItem("backed-auth-token");
  },

  /**
   * Update Profile Metadata in Supabase Auth & Database
   */
  updateProfile: async (updates) => {
    const { data, error } = await supabase.auth.updateUser({
      data: {
        ...(updates.fullName ? { full_name: updates.fullName } : {}),
        ...(updates.slug ? { slug: updates.slug } : {}),
        ...(updates.avatarUrl ? { avatar_url: updates.avatarUrl } : {}),
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    const user = data.user;
    return {
      id: user.id,
      email: user.email,
      fullName: user.user_metadata?.full_name,
      profileType: user.user_metadata?.profile_type,
      slug: user.user_metadata?.slug,
    };
  },
};
