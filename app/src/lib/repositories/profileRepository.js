// ============================================================================
// PROOF-ID / BACKED — PROFILE REPOSITORY (SUPABASE CANONICAL)
// Fulfills Slice 2: Persist Person and Business profiles through Supabase.
// ============================================================================

import { supabase } from "../supabaseClient";
import { enqueueOfflineMutation } from "../offlineQueue";

export const profileRepository = {
  /**
   * Fetch a single profile by unique slug with capabilities and business details
   */
  async getBySlug(slug) {
    if (!slug) throw new Error("Slug is required");

    const { data: profile, error } = await supabase
      .from("profiles")
      .select(`
        *,
        business_details (*),
        profile_capabilities (
          id,
          display_order,
          capabilities (
            id,
            name,
            category
          )
        )
      `)
      .eq("slug", slug.toLowerCase())
      .maybeSingle();

    if (error) {
      console.error(`[profileRepository] Error fetching profile "${slug}":`, error);
      throw error;
    }

    if (!profile) return null;

    // Normalize capabilities structure for UI consumption
    const capabilities = (profile.profile_capabilities || []).map((pc) => ({
      id: pc.capabilities?.id,
      name: pc.capabilities?.name || "Capability",
      category: pc.capabilities?.category || "General",
      display_order: pc.display_order,
    }));

    return {
      ...profile,
      capabilities,
      businessDetails: profile.business_details || null,
    };
  },

  /**
   * Fetch current authenticated user's profile
   */
  async getCurrentUserProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile, error } = await supabase
      .from("profiles")
      .select(`
        *,
        business_details (*),
        profile_capabilities (
          id,
          display_order,
          capabilities (
            id,
            name,
            category
          )
        )
      `)
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error("[profileRepository] Error fetching current user profile:", error);
      throw error;
    }

    return profile;
  },

  /**
   * Update profile fields (client-allowed fields only: headline, bio, location, etc.)
   */
  async updateProfile(profileId, updates) {
    if (!profileId) throw new Error("Profile ID is required");

    // Whitelist only client-writable fields to prevent tampering
    const allowed = {
      full_name: updates.full_name || updates.fullName,
      business_name: updates.business_name || updates.businessName,
      headline: updates.headline,
      bio: updates.bio,
      location: updates.location,
      avatar_url: updates.avatar_url || updates.avatarUrl,
      banner_url: updates.banner_url || updates.bannerUrl,
      availability_status: updates.availability_status || updates.availabilityStatus,
      updated_at: new Date().toISOString(),
    };

    // Remove undefined entries
    Object.keys(allowed).forEach((k) => allowed[k] === undefined && delete allowed[k]);

    const { data, error } = await supabase
      .from("profiles")
      .update(allowed)
      .eq("id", profileId)
      .select()
      .single();

    if (error) {
      console.warn("[profileRepository] Update failed, enqueuing offline mutation:", error);
      await enqueueOfflineMutation({
        type: "UPDATE_PROFILE",
        profileId,
        updates: allowed,
      });
      throw error;
    }

    return data;
  },

  /**
   * Update or insert business details extension
   */
  async upsertBusinessDetails(profileId, businessDetails) {
    if (!profileId) throw new Error("Profile ID is required");

    const payload = {
      profile_id: profileId,
      regions_served: businessDetails.regions_served || businessDetails.regionsServed || [],
      payment_terms: businessDetails.payment_terms || businessDetails.paymentTerms,
      sample_availability: businessDetails.sample_availability || businessDetails.sampleAvailability,
      facility_description: businessDetails.facility_description || businessDetails.facilityDescription,
      facility_photos: businessDetails.facility_photos || businessDetails.facilityPhotos || [],
      certifications: businessDetails.certifications || [],
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("business_details")
      .upsert(payload)
      .select()
      .single();

    if (error) {
      console.error("[profileRepository] Error upserting business details:", error);
      throw error;
    }

    return data;
  },

  /**
   * Atomically publish profile through RPC (Slice 3 requirement)
   */
  async publishProfile(profileId) {
    const { data, error } = await supabase.rpc("publish_profile", {
      p_profile_id: profileId,
    });

    if (error) {
      console.error("[profileRepository] Failed to publish profile via RPC:", error);
      throw error;
    }

    return data;
  },

  /**
   * Check slug availability via RPC
   */
  async checkSlugAvailability(slug) {
    if (!slug) return false;
    const cleanSlug = slug.trim().toLowerCase();

    const { data, error } = await supabase.rpc("check_slug_availability", {
      target_slug: cleanSlug,
    });

    if (error) {
      console.warn("[profileRepository] check_slug_availability RPC error, falling back to direct count:", error);
      const { count } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("slug", cleanSlug);
      return count === 0;
    }

    return Boolean(data);
  },

  /**
   * Search / Discover published profiles
   */
  async searchPublishedProfiles({ query = "", category = null, location = null, availability = null } = {}) {
    const { data, error } = await supabase.rpc("search_profiles", {
      p_query: query || null,
      p_category: category || null,
      p_location: location || null,
      p_availability: availability || null,
    });

    if (error) {
      console.warn("[profileRepository] search_profiles RPC fallback to select:", error);
      let q = supabase
        .from("profiles")
        .select("id, slug, profile_type, full_name, business_name, headline, location, avatar_url, availability_status")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (query) {
        q = q.or(`full_name.ilike.%${query}%,headline.ilike.%${query}%,business_name.ilike.%${query}%`);
      }
      if (location) {
        q = q.ilike("location", `%${location}%`);
      }
      const res = await q;
      return res.data || [];
    }

    return data || [];
  },

  /**
   * Track profile view
   */
  async trackView(profileId) {
    if (!profileId) return;
    try {
      const today = new Date().toISOString().split("T")[0];
      await supabase.rpc("increment_daily_page_view", {
        p_profile_id: profileId,
        p_date: today,
      });
    } catch {
      // Non-critical telemetry logging
    }
  },
};
