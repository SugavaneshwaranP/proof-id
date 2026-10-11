// ============================================================================
// PROOF-ID / BACKED — PROJECT REPOSITORY (SUPABASE CANONICAL)
// Fulfills Slice 2: Person projects portfolio persistence in Supabase.
// ============================================================================

import { supabase } from "../supabaseClient";
import { enqueueOfflineMutation } from "../offlineQueue";

export const projectRepository = {
  async getByProfileId(profileId) {
    if (!profileId) throw new Error("Profile ID is required");

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("profile_id", profileId)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[projectRepository] Error fetching projects:", error);
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

  async createProject({ profileId, title, oneLineResult = "", description = "", projectUrl = "", displayOrder = 0 }) {
    if (!profileId || !title) throw new Error("profileId and title are required");

    const payload = {
      profile_id: profileId,
      title,
      one_line_result: oneLineResult,
      description,
      project_url: projectUrl,
      display_order: displayOrder,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("projects")
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.warn("[projectRepository] Insert failed, queuing offline mutation:", error);
      await enqueueOfflineMutation({
        type: "CREATE_PROJECT",
        payload,
      });
      throw error;
    }

    return data;
  },

  async updateProject(id, updates) {
    if (!id) throw new Error("Project ID is required");

    const allowed = {
      title: updates.title,
      one_line_result: updates.one_line_result || updates.oneLineResult,
      description: updates.description,
      project_url: updates.project_url || updates.projectUrl,
      display_order: updates.display_order ?? updates.displayOrder,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("projects")
      .update(allowed)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[projectRepository] Update project failed:", error);
      throw error;
    }

    return data;
  },

  async deleteProject(id) {
    if (!id) throw new Error("Project ID is required");

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[projectRepository] Delete project failed:", error);
      throw error;
    }

    return true;
  },
};
