// ============================================================================
// PROOF-ID / BACKED — PRODUCT REPOSITORY (SUPABASE CANONICAL)
// Fulfills Slice 2: Business products portfolio persistence in Supabase.
// ============================================================================

import { supabase } from "../supabaseClient";
import { enqueueOfflineMutation } from "../offlineQueue";

export const productRepository = {
  async getByProfileId(profileId) {
    if (!profileId) throw new Error("Profile ID is required");

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("profile_id", profileId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[productRepository] Error fetching products:", error);
      throw error;
    }

    return data || [];
  },

  async getBySlug(slug) {
    if (!slug) throw new Error("Slug is required");

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("slug", slug.toLowerCase())
      .maybeSingle();

    if (error || !profile) return [];

    return this.getByProfileId(profile.id);
  },

  async createProduct({ profileId, name, category = "", shortDescription = "", minimumOrder = "", leadTime = "", imageUrl = "" }) {
    if (!profileId || !name) throw new Error("profileId and name are required");

    const payload = {
      profile_id: profileId,
      name,
      category,
      short_description: shortDescription,
      minimum_order: minimumOrder,
      lead_time: leadTime,
      image_url: imageUrl,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("products")
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.warn("[productRepository] Insert failed, queuing offline mutation:", error);
      await enqueueOfflineMutation({
        type: "CREATE_PRODUCT",
        payload,
      });
      throw error;
    }

    return data;
  },

  async updateProduct(id, updates) {
    if (!id) throw new Error("Product ID is required");

    const allowed = {
      name: updates.name,
      category: updates.category,
      short_description: updates.short_description || updates.shortDescription,
      minimum_order: updates.minimum_order || updates.minimumOrder,
      lead_time: updates.lead_time || updates.leadTime,
      image_url: updates.image_url || updates.imageUrl,
    };

    const { data, error } = await supabase
      .from("products")
      .update(allowed)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[productRepository] Update product failed:", error);
      throw error;
    }

    return data;
  },

  async deleteProduct(id) {
    if (!id) throw new Error("Product ID is required");

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[productRepository] Delete product failed:", error);
      throw error;
    }

    return true;
  },
};
