// ============================================================================
// PROOF-ID / BACKED — EVIDENCE REPOSITORY (SUPABASE CANONICAL)
// Fulfills Slice 2: Evidence persistence, proof status lifecycle, and verification links.
// ============================================================================

import { supabase } from "../supabaseClient";
import { enqueueOfflineMutation } from "../offlineQueue";

export const evidenceRepository = {
  /**
   * Fetch all evidence items for a given profile ID or slug
   */
  async getByProfileId(profileId) {
    if (!profileId) throw new Error("Profile ID is required");

    const { data, error } = await supabase
      .from("evidence_items")
      .select(`
        *,
        verification_requests (
          id,
          verifier_name,
          verifier_email,
          status,
          created_at,
          resolved_at
        )
      `)
      .eq("profile_id", profileId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[evidenceRepository] Error fetching evidence items:", error);
      throw error;
    }

    return data || [];
  },

  /**
   * Fetch evidence items by profile slug (for public view)
   */
  async getBySlug(slug) {
    if (!slug) throw new Error("Slug is required");

    const { data: profile, error: profErr } = await supabase
      .from("profiles")
      .select("id")
      .eq("slug", slug.toLowerCase())
      .maybeSingle();

    if (profErr || !profile) return [];

    return this.getByProfileId(profile.id);
  },

  /**
   * Create a new evidence item
   */
  async createEvidence({ profileId, title, category, evidenceType = "link", externalUrl = null, filePath = null, fileHash = null }) {
    if (!profileId || !title) throw new Error("profileId and title are required");

    const payload = {
      profile_id: profileId,
      title,
      category: category || "General Proof",
      evidence_type: evidenceType,
      external_url: externalUrl,
      file_path: filePath,
      file_hash: fileHash,
      status: "unverified",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("evidence_items")
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.warn("[evidenceRepository] Insert failed, queuing offline mutation:", error);
      await enqueueOfflineMutation({
        type: "CREATE_EVIDENCE",
        payload,
      });
      throw error;
    }

    return data;
  },

  /**
   * Update evidence item metadata (title, category, externalUrl)
   */
  async updateEvidence(id, updates) {
    if (!id) throw new Error("Evidence ID is required");

    const allowed = {
      title: updates.title,
      category: updates.category,
      external_url: updates.external_url || updates.externalUrl,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("evidence_items")
      .update(allowed)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[evidenceRepository] Update evidence failed:", error);
      throw error;
    }

    return data;
  },

  /**
   * Delete an evidence item
   */
  async deleteEvidence(id) {
    if (!id) throw new Error("Evidence ID is required");

    const { error } = await supabase
      .from("evidence_items")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[evidenceRepository] Delete evidence failed:", error);
      throw error;
    }

    return true;
  },

  /**
   * Dispatch verification request via Edge Function
   */
  async requestVerification({ profileId, evidenceId, verifierName, verifierEmail, note = "" }) {
    if (!profileId || !evidenceId || !verifierEmail) {
      throw new Error("profileId, evidenceId, and verifierEmail are required");
    }

    const { data, error } = await supabase.functions.invoke("send-verification-email", {
      body: {
        profileId,
        evidenceId,
        verifierName,
        verifierEmail,
        note,
      },
    });

    if (error) {
      console.error("[evidenceRepository] Verification dispatch failed:", error);
      throw error;
    }

    return data;
  },

  /**
   * Fetch all verification requests for a profile
   */
  async getVerificationRequests(profileId) {
    if (!profileId) throw new Error("profileId is required");

    const { data, error } = await supabase
      .from("verification_requests")
      .select(`
        *,
        evidence_items (
          id,
          title,
          category,
          status
        )
      `)
      .eq("profile_id", profileId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[evidenceRepository] Error fetching verification requests:", error);
      throw error;
    }

    return (data || []).map((req) => ({
      id: req.id,
      evidenceId: req.evidence_id,
      proofTitle: req.evidence_items?.title || "Evidence Claim",
      category: req.evidence_items?.category || "General Proof",
      verifierName: req.verifier_name,
      verifierEmail: req.verifier_email,
      status: req.status === "confirmed" ? "Confirmed" : req.status === "declined" ? "Declined" : "Waiting",
      note: req.note,
      dateSent: req.created_at ? new Date(req.created_at).toLocaleDateString() : "Recent",
      resolvedAt: req.resolved_at,
    }));
  },

  /**
   * Cancel / delete a verification request
   */
  async cancelVerificationRequest(requestId) {
    if (!requestId) throw new Error("requestId is required");

    const { error } = await supabase
      .from("verification_requests")
      .delete()
      .eq("id", requestId);

    if (error) {
      console.error("[evidenceRepository] Error canceling verification request:", error);
      throw error;
    }

    return true;
  },

  /**
   * Upload an evidence document to private evidence-vault via Edge Function
   */
  async uploadEvidenceFile(file) {
    if (!file) throw new Error("File is required");

    // 1. Request short-lived signed upload URL from Edge Function
    const { data: uploadMeta, error: metaErr } = await supabase.functions.invoke("generate-upload-url", {
      body: {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      },
    });

    if (metaErr || !uploadMeta?.signedUrl) {
      // Direct Storage fallback if Edge Function auth is missing or direct upload permitted
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required for evidence upload");
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `user_${user.id}/${Date.now()}_${safeName}`;
      const { error: storageErr } = await supabase.storage
        .from("evidence-vault")
        .upload(path, file);
      if (storageErr) throw storageErr;
      return { path, fileName: file.name };
    }

    // 2. Upload file via signed URL
    const res = await fetch(uploadMeta.signedUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    if (!res.ok) {
      throw new Error(`Storage upload failed with HTTP ${res.status}`);
    }

    return { path: uploadMeta.path, fileName: file.name };
  },
};

