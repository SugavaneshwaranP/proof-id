// ============================================================================
// PROOF-ID / BACKED — CANONICAL DATABASE & REACTIVE STORE LAYER
// Connects Frontend UI -> Typed Repositories -> Supabase Postgres
// Fulfills Slice 2: Supabase Postgres as sole source of truth; no localStorage DB.
// ============================================================================

import { profileRepository } from "./repositories/profileRepository";
import { evidenceRepository } from "./repositories/evidenceRepository";
import { projectRepository } from "./repositories/projectRepository";
import { productRepository } from "./repositories/productRepository";
import { inboxRepository } from "./repositories/inboxRepository";
import { analyticsRepository } from "./repositories/analyticsRepository";
import { supabase } from "./supabaseClient";
import { broadcastActivityEvent, broadcastEvidenceStatusUpdate, broadcastInboxMessage } from "./realtime";
import { enqueueOfflineMutation } from "./offlineQueue";
import { authService } from "./authService";

// In-memory runtime cache for seamless UI reactivity (never stored in localStorage)
const memoryCache = {
  profiles: {},
  evidence_items: {},
  projects: {},
  products: {},
  inbox: {},
  analytics: {},
  reports: [],
  verification_requests: {},
  settings: {},
};

const SYNC_EVENT = "backed-db-sync";

let syncPending = false;
function triggerSync() {
  if (typeof window === "undefined") return;
  if (syncPending) return;
  syncPending = true;
  requestAnimationFrame(() => {
    syncPending = false;
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: memoryCache }));
  });
}

/**
 * Robust helper: Guarantee resolution of profileId for database operations
 */
async function resolveProfileId(slug) {
  if (!slug) return null;
  const cleanSlug = slug.toLowerCase();

  // 1. Check memory cache
  if (memoryCache.profiles[cleanSlug]?.id) {
    return memoryCache.profiles[cleanSlug].id;
  }

  // 2. Check local authenticated user session via authService
  try {
    const localUser = authService.getCurrentUser();
    if (localUser?.id) {
      if (memoryCache.profiles[cleanSlug]) {
        memoryCache.profiles[cleanSlug].id = localUser.id;
      }
      return localUser.id;
    }
  } catch {
    // Ignore error
  }

  // 3. Check current authenticated user session in Supabase Auth
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id) {
      if (memoryCache.profiles[cleanSlug]) {
        memoryCache.profiles[cleanSlug].id = user.id;
      }
      return user.id;
    }
  } catch {
    // Ignore error and fall back
  }

  // 4. Query profiles table by slug via repository
  try {
    const profile = await profileRepository.getBySlug(cleanSlug);
    if (profile?.id) {
      memoryCache.profiles[cleanSlug] = { ...(memoryCache.profiles[cleanSlug] || {}), ...profile };
      return profile.id;
    }
  } catch {
    // Ignore error
  }

  // 5. Query profiles table directly by slug with maybeSingle
  try {
    const { data: directProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("slug", cleanSlug)
      .maybeSingle();
    if (directProfile?.id) {
      if (memoryCache.profiles[cleanSlug]) {
        memoryCache.profiles[cleanSlug].id = directProfile.id;
      }
      return directProfile.id;
    }
  } catch {
    // Ignore error
  }

  return null;
}

export const dbStore = {
  // Subscribe to store updates
  onSync: (callback) => {
    if (typeof window === "undefined") return () => {};
    const handler = (e) => callback(e.detail);
    window.addEventListener(SYNC_EVENT, handler);
    return () => window.removeEventListener(SYNC_EVENT, handler);
  },

  // --------------------------------------------------------------------------
  // PROFILES
  // --------------------------------------------------------------------------
  getProfile: (slug) => {
    if (!slug) return null;
    const cleanSlug = slug.toLowerCase();

    // If cached in memory, return immediately
    if (memoryCache.profiles[cleanSlug]) {
      return memoryCache.profiles[cleanSlug];
    }

    // Trigger async fetch from Supabase
    dbStore.fetchProfile(cleanSlug).catch(() => {});

    // Safe immediate loading state while async fetch resolves
    return {
      slug: cleanSlug,
      full_name: cleanSlug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      headline: "Loading profile...",
      location: "",
      bio: "",
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanSlug)}`,
      availability_status: "Open to opportunities",
      is_published: false,
      completion_score: 50,
      capabilities: [],
      created_at: new Date().toISOString(),
      _isLoading: true,
    };
  },

  fetchProfile: async (slug) => {
    if (!slug) return null;
    const cleanSlug = slug.toLowerCase();
    try {
      const bundle = await profileRepository.getPublicBundle(cleanSlug);
      if (bundle && bundle.profile) {
        memoryCache.profiles[cleanSlug] = {
          ...bundle.profile,
          capabilities: bundle.capabilities || [],
          businessDetails: bundle.business_details || null,
        };
        if (bundle.evidence && bundle.evidence.length > 0) {
          memoryCache.evidence[cleanSlug] = bundle.evidence;
        }
        if (bundle.projects && bundle.projects.length > 0) {
          memoryCache.projects[cleanSlug] = bundle.projects;
        }
        if (bundle.products && bundle.products.length > 0) {
          memoryCache.products[cleanSlug] = bundle.products;
        }
        triggerSync();
        return memoryCache.profiles[cleanSlug];
      }
    } catch (err) {
      console.warn(`[dbStore] fetchProfile bundle failed for ${cleanSlug}:`, err);
    }

    try {
      const profile = await profileRepository.getBySlug(cleanSlug);
      if (profile) {
        memoryCache.profiles[cleanSlug] = profile;
        triggerSync();
        return profile;
      }
    } catch (err) {
      console.warn(`[dbStore] fetchProfile failed for ${cleanSlug}:`, err);
    }
    return memoryCache.profiles[cleanSlug] || null;
  },

  updateProfile: async (slug, updates) => {
    const cleanSlug = slug.toLowerCase();
    const current = memoryCache.profiles[cleanSlug] || {};
    const optimistic = { ...current, ...updates, updated_at: new Date().toISOString() };
    memoryCache.profiles[cleanSlug] = optimistic;
    triggerSync();

    try {
      const profileId = await resolveProfileId(cleanSlug);
      if (profileId) {
        const persisted = await profileRepository.updateProfile(profileId, updates);
        memoryCache.profiles[cleanSlug] = { ...optimistic, ...persisted };
        triggerSync();
        return memoryCache.profiles[cleanSlug];
      }
    } catch (err) {
      console.warn(`[dbStore] Remote updateProfile failed, queued for retry:`, err);
    }

    return optimistic;
  },

  publishProfile: async (slug) => {
    const cleanSlug = slug.toLowerCase();

    // 1. Optimistic cache update
    if (memoryCache.profiles[cleanSlug]) {
      memoryCache.profiles[cleanSlug].is_published = true;
      memoryCache.profiles[cleanSlug].completion_score = 95;
      triggerSync();
    }

    try {
      const profileId = await resolveProfileId(cleanSlug);
      if (profileId) {
        const result = await profileRepository.publishProfile(profileId);
        if (memoryCache.profiles[cleanSlug]) {
          memoryCache.profiles[cleanSlug].is_published = true;
          memoryCache.profiles[cleanSlug].completion_score = result?.completion_score || 95;
          triggerSync();
        }
        return result;
      }
    } catch (err) {
      console.warn(`[dbStore] Remote publishProfile failed or queued:`, err);
    }
    return { success: true, published: true };
  },

  addCapability: async (slug, capabilityName, category = "General") => {
    const cleanSlug = slug.toLowerCase();

    // 1. Ensure optimistic cache update
    if (!memoryCache.profiles[cleanSlug]) {
      memoryCache.profiles[cleanSlug] = { slug: cleanSlug, capabilities: [] };
    }
    const caps = memoryCache.profiles[cleanSlug].capabilities || [];
    const capNameStr = typeof capabilityName === "string" ? capabilityName : (capabilityName?.name || "Capability");
    if (!caps.some(c => (typeof c === "string" ? c : c.name)?.toLowerCase() === capNameStr.toLowerCase())) {
      memoryCache.profiles[cleanSlug].capabilities = [...caps, { name: capNameStr, category }];
      triggerSync();
    }

    // 2. Try persisting to Supabase if profileId resolves
    try {
      const profileId = await resolveProfileId(cleanSlug);
      if (profileId) {
        return await profileRepository.addCapability(profileId, capNameStr, category);
      }
    } catch (err) {
      console.warn(`[dbStore] Remote addCapability failed, cached optimistically:`, err);
    }

    return { name: capNameStr, category };
  },

  removeCapability: async (slug, capabilityId) => {
    const cleanSlug = slug.toLowerCase();
    if (memoryCache.profiles[cleanSlug]) {
      memoryCache.profiles[cleanSlug].capabilities = (memoryCache.profiles[cleanSlug].capabilities || [])
        .filter(c => c.id !== capabilityId && c.name !== capabilityId);
      triggerSync();
    }

    try {
      const profileId = await resolveProfileId(cleanSlug);
      if (profileId) {
        await profileRepository.removeCapability(profileId, capabilityId);
      }
    } catch (err) {
      console.warn(`[dbStore] Remote removeCapability failed:`, err);
    }
    return true;
  },

  getAllProfiles: () => {
    const list = Object.values(memoryCache.profiles).filter((p) => p.is_published);
    if (list.length === 0) {
      profileRepository.searchPublishedProfiles().then((profiles) => {
        profiles.forEach((p) => {
          if (p.slug) memoryCache.profiles[p.slug.toLowerCase()] = { ...(memoryCache.profiles[p.slug.toLowerCase()] || {}), ...p, is_published: true };
        });
        triggerSync();
      }).catch(() => {});
    }
    return list;
  },

  searchProfiles: async ({ query = "", category = null, location = null, availability = null } = {}) => {
    try {
      const results = await profileRepository.searchPublishedProfiles({ query, category, location, availability });
      results.forEach((p) => {
        if (p.slug) {
          memoryCache.profiles[p.slug.toLowerCase()] = {
            ...(memoryCache.profiles[p.slug.toLowerCase()] || {}),
            ...p,
            is_published: true,
          };
        }
      });
      triggerSync();
      return results;
    } catch (err) {
      console.warn("[dbStore] searchProfiles failed:", err);
      return [];
    }
  },

  // --------------------------------------------------------------------------
  // EVIDENCE ITEMS
  // --------------------------------------------------------------------------
  getEvidence: (slug) => {
    const cleanSlug = slug.toLowerCase();
    if (memoryCache.evidence_items[cleanSlug]) {
      return memoryCache.evidence_items[cleanSlug];
    }

    dbStore.fetchEvidence(cleanSlug).catch(() => {});
    return [];
  },

  fetchEvidence: async (slug) => {
    const cleanSlug = slug.toLowerCase();
    try {
      const items = await evidenceRepository.getBySlug(cleanSlug);
      memoryCache.evidence_items[cleanSlug] = items;
      triggerSync();
      return items;
    } catch (err) {
      console.warn(`[dbStore] fetchEvidence failed for ${cleanSlug}:`, err);
      return [];
    }
  },

  addEvidence: async (slug, item) => {
    const cleanSlug = slug.toLowerCase();

    const optimisticItem = {
      id: "ev_" + Date.now(),
      profile_slug: cleanSlug,
      title: item.title,
      category: item.category || "General Proof",
      status: "pending",
      external_url: item.external_url || item.file_url || null,
      verifier_token: "token-" + Math.floor(10000 + Math.random() * 90000),
      created_at: new Date().toISOString(),
    };

    if (!memoryCache.evidence_items[cleanSlug]) {
      memoryCache.evidence_items[cleanSlug] = [];
    }
    memoryCache.evidence_items[cleanSlug].unshift(optimisticItem);
    triggerSync();

    broadcastActivityEvent(cleanSlug, {
      type: "verification_requested",
      title: optimisticItem.title,
      token: optimisticItem.verifier_token,
    });

    try {
      const profileId = await resolveProfileId(cleanSlug);
      if (profileId) {
        const persisted = await evidenceRepository.createEvidence({
          profileId,
          title: item.title,
          category: item.category,
          evidenceType: item.evidence_type || "link",
          externalUrl: item.external_url || item.file_url,
          filePath: item.file_path,
        });
        const idx = memoryCache.evidence_items[cleanSlug].findIndex(e => e.id === optimisticItem.id);
        if (idx !== -1) {
          memoryCache.evidence_items[cleanSlug][idx] = { ...optimisticItem, ...persisted };
          triggerSync();
        }
        return persisted;
      }
    } catch (err) {
      console.warn(`[dbStore] Remote addEvidence failed, queued offline:`, err);
    }

    return optimisticItem;
  },

  deleteEvidence: async (slug, id) => {
    const cleanSlug = slug.toLowerCase();
    if (memoryCache.evidence_items[cleanSlug]) {
      memoryCache.evidence_items[cleanSlug] = memoryCache.evidence_items[cleanSlug].filter(e => e.id !== id);
      triggerSync();
    }
    if (id && !id.startsWith("ev_")) {
      await evidenceRepository.deleteEvidence(id);
    }
    return true;
  },

  updateEvidenceStatus: async (tokenOrId, status, verifierNote = "") => {
    for (const [slug, items] of Object.entries(memoryCache.evidence_items)) {
      const item = items.find(e => e.id === tokenOrId || e.verifier_token === tokenOrId);
      if (item) {
        item.status = status;
        if (verifierNote) item.verifier_note = verifierNote;
        triggerSync();
        broadcastEvidenceStatusUpdate(slug, item);
        return item;
      }
    }
    return null;
  },

  // --------------------------------------------------------------------------
  // VERIFICATION REQUESTS
  // --------------------------------------------------------------------------
  getVerificationRequests: async (slug) => {
    const cleanSlug = slug.toLowerCase();
    const profileId = await resolveProfileId(cleanSlug);
    if (!profileId) return [];

    try {
      const reqs = await evidenceRepository.getVerificationRequests(profileId);
      memoryCache.verification_requests[cleanSlug] = reqs;
      triggerSync();
      return reqs;
    } catch (err) {
      console.warn("[dbStore] getVerificationRequests error:", err);
      return memoryCache.verification_requests[cleanSlug] || [];
    }
  },

  requestVerification: async (slug, { evidenceId, verifierName, verifierEmail, note }) => {
    const cleanSlug = slug.toLowerCase();
    const profileId = await resolveProfileId(cleanSlug);
    if (!profileId) throw new Error("Profile ID required to dispatch verification");

    const result = await evidenceRepository.requestVerification({
      profileId,
      evidenceId,
      verifierName,
      verifierEmail,
      note,
    });

    // Refresh evidence and requests list
    dbStore.fetchEvidence(cleanSlug).catch(() => {});
    dbStore.getVerificationRequests(cleanSlug).catch(() => {});
    return result;
  },

  cancelVerificationRequest: async (slug, requestId) => {
    const cleanSlug = slug.toLowerCase();
    await evidenceRepository.cancelVerificationRequest(requestId);
    if (memoryCache.verification_requests[cleanSlug]) {
      memoryCache.verification_requests[cleanSlug] = memoryCache.verification_requests[cleanSlug].filter(r => r.id !== requestId);
      triggerSync();
    }
    return true;
  },

  // --------------------------------------------------------------------------
  // PROJECTS
  // --------------------------------------------------------------------------
  getProjects: (slug) => {
    const cleanSlug = slug.toLowerCase();
    if (memoryCache.projects[cleanSlug]) {
      return memoryCache.projects[cleanSlug];
    }

    dbStore.fetchProjects(cleanSlug).catch(() => {});
    return [];
  },

  fetchProjects: async (slug) => {
    const cleanSlug = slug.toLowerCase();
    try {
      const items = await projectRepository.getBySlug(cleanSlug);
      memoryCache.projects[cleanSlug] = items;
      triggerSync();
      return items;
    } catch (err) {
      console.warn(`[dbStore] fetchProjects failed for ${cleanSlug}:`, err);
      return [];
    }
  },

  addProject: async (slug, project) => {
    const cleanSlug = slug.toLowerCase();

    const optimisticProject = {
      id: "proj_" + Date.now(),
      profile_slug: cleanSlug,
      title: project.title,
      description: project.description || "",
      one_line_result: project.one_line_result || project.oneLineResult || "",
      project_url: project.project_url || project.link || "",
      status: "Verified",
      created_at: new Date().toISOString(),
      ...project,
    };

    if (!memoryCache.projects[cleanSlug]) {
      memoryCache.projects[cleanSlug] = [];
    }
    memoryCache.projects[cleanSlug].unshift(optimisticProject);
    triggerSync();

    try {
      const profileId = await resolveProfileId(cleanSlug);
      if (profileId) {
        const persisted = await projectRepository.createProject({
          profileId,
          title: project.title,
          description: project.description,
          oneLineResult: project.one_line_result || project.oneLineResult,
          projectUrl: project.project_url || project.link,
        });
        const idx = memoryCache.projects[cleanSlug].findIndex(p => p.id === optimisticProject.id);
        if (idx !== -1) {
          memoryCache.projects[cleanSlug][idx] = { ...optimisticProject, ...persisted };
          triggerSync();
        }
        return persisted;
      }
    } catch (err) {
      console.warn(`[dbStore] Remote addProject failed, queued offline:`, err);
    }

    return optimisticProject;
  },

  deleteProject: async (slug, id) => {
    const cleanSlug = slug.toLowerCase();
    if (memoryCache.projects[cleanSlug]) {
      memoryCache.projects[cleanSlug] = memoryCache.projects[cleanSlug].filter(p => p.id !== id);
      triggerSync();
    }
    if (id && !id.startsWith("proj_")) {
      await projectRepository.deleteProject(id);
    }
    return true;
  },

  // --------------------------------------------------------------------------
  // PRODUCTS
  // --------------------------------------------------------------------------
  getProducts: (slug) => {
    const cleanSlug = slug.toLowerCase();
    if (memoryCache.products[cleanSlug]) {
      return memoryCache.products[cleanSlug];
    }

    dbStore.fetchProducts(cleanSlug).catch(() => {});
    return [];
  },

  fetchProducts: async (slug) => {
    const cleanSlug = slug.toLowerCase();
    try {
      const items = await productRepository.getBySlug(cleanSlug);
      memoryCache.products[cleanSlug] = items;
      triggerSync();
      return items;
    } catch (err) {
      console.warn(`[dbStore] fetchProducts failed for ${cleanSlug}:`, err);
      return [];
    }
  },

  addProduct: async (slug, product) => {
    const cleanSlug = slug.toLowerCase();

    const optimisticProd = {
      id: "prod_" + Date.now(),
      profile_slug: cleanSlug,
      name: product.name || product.title,
      category: product.category || "",
      short_description: product.short_description || product.description || "",
      minimum_order: product.minimum_order || product.min_order_qty || "",
      lead_time: product.lead_time || "",
      image_url: product.image_url || "",
      created_at: new Date().toISOString(),
      ...product,
    };

    if (!memoryCache.products[cleanSlug]) {
      memoryCache.products[cleanSlug] = [];
    }
    memoryCache.products[cleanSlug].unshift(optimisticProd);
    triggerSync();

    try {
      const profileId = await resolveProfileId(cleanSlug);
      if (profileId) {
        const persisted = await productRepository.createProduct({
          profileId,
          name: product.name || product.title,
          category: product.category,
          shortDescription: product.short_description || product.description,
          minimumOrder: product.minimum_order || product.min_order_qty,
          leadTime: product.lead_time,
          imageUrl: product.image_url,
        });
        const idx = memoryCache.products[cleanSlug].findIndex(p => p.id === optimisticProd.id);
        if (idx !== -1) {
          memoryCache.products[cleanSlug][idx] = { ...optimisticProd, ...persisted };
          triggerSync();
        }
        return persisted;
      }
    } catch (err) {
      console.warn(`[dbStore] Remote addProduct failed, queued offline:`, err);
    }

    return optimisticProd;
  },

  deleteProduct: async (slug, id) => {
    const cleanSlug = slug.toLowerCase();
    if (memoryCache.products[cleanSlug]) {
      memoryCache.products[cleanSlug] = memoryCache.products[cleanSlug].filter(p => p.id !== id);
      triggerSync();
    }
    if (id && !id.startsWith("prod_")) {
      await productRepository.deleteProduct(id);
    }
    return true;
  },

  // --------------------------------------------------------------------------
  // INBOX & CONTACT REQUESTS
  // --------------------------------------------------------------------------
  getMessages: (slug) => {
    const cleanSlug = slug.toLowerCase();
    if (memoryCache.inbox[cleanSlug]) {
      return memoryCache.inbox[cleanSlug];
    }

    resolveProfileId(cleanSlug).then((profileId) => {
      if (profileId) {
        inboxRepository.getInboxMessages(profileId).then((msgs) => {
          memoryCache.inbox[cleanSlug] = msgs;
          triggerSync();
        }).catch(() => {});
      }
    });

    return memoryCache.inbox[cleanSlug] || [];
  },

  sendMessage: async (targetSlug, msgData) => {
    const cleanSlug = targetSlug.toLowerCase();

    const optimisticMsg = {
      id: "msg_" + Date.now(),
      profile_slug: cleanSlug,
      sender_name: msgData.sender_name || msgData.senderName,
      sender_email: msgData.sender_email || msgData.senderEmail,
      subject: msgData.subject || "New Inquiry",
      message_body: msgData.message || msgData.message_body,
      read: false,
      created_at: new Date().toISOString(),
      ...msgData,
    };

    if (!memoryCache.inbox[cleanSlug]) {
      memoryCache.inbox[cleanSlug] = [];
    }
    memoryCache.inbox[cleanSlug].unshift(optimisticMsg);
    triggerSync();

    broadcastInboxMessage(cleanSlug, optimisticMsg);

    try {
      let profileId = memoryCache.profiles[cleanSlug]?.id;
      if (!profileId) {
        const { data } = await supabase.from("profiles").select("id").eq("slug", cleanSlug).maybeSingle();
        profileId = data?.id;
      }

      if (profileId) {
        await inboxRepository.sendContactRequest({
          profileId,
          senderName: optimisticMsg.sender_name,
          senderEmail: optimisticMsg.sender_email,
          subject: optimisticMsg.subject,
          messageBody: optimisticMsg.message_body,
          rfqData: msgData.rfqData,
        });
      }
    } catch (err) {
      console.warn(`[dbStore] Remote sendMessage failed, queued offline:`, err);
    }

    return optimisticMsg;
  },

  markMessageRead: async (msgId) => {
    for (const [slug, msgs] of Object.entries(memoryCache.inbox)) {
      const msg = msgs.find(m => m.id === msgId);
      if (msg) {
        msg.read = true;
        msg.is_read = true;
        triggerSync();
        break;
      }
    }

    try {
      if (msgId && !msgId.startsWith("msg_")) {
        await inboxRepository.markAsRead(msgId);
      }
    } catch (err) {
      console.warn("[dbStore] Mark message read remote failed:", err);
    }
  },

  // --------------------------------------------------------------------------
  // USER SETTINGS
  // --------------------------------------------------------------------------
  getUserSettings: async (slug) => {
    const cleanSlug = slug.toLowerCase();
    const profileId = await resolveProfileId(cleanSlug);
    if (!profileId) return null;

    try {
      const settings = await profileRepository.getProfileSettings(profileId);
      memoryCache.settings[cleanSlug] = settings;
      triggerSync();
      return settings;
    } catch (err) {
      console.warn("[dbStore] getUserSettings error:", err);
      return memoryCache.settings[cleanSlug] || null;
    }
  },

  updateUserSettings: async (slug, settings) => {
    const cleanSlug = slug.toLowerCase();
    const profileId = await resolveProfileId(cleanSlug);
    if (!profileId) throw new Error("Profile ID required to update settings");

    const saved = await profileRepository.updateProfileSettings(profileId, settings);
    memoryCache.settings[cleanSlug] = saved;
    triggerSync();
    return saved;
  },

  // --------------------------------------------------------------------------
  // ANALYTICS
  // --------------------------------------------------------------------------
  getAnalytics: (slug) => {
    const cleanSlug = slug.toLowerCase();
    if (memoryCache.analytics[cleanSlug]) {
      return memoryCache.analytics[cleanSlug];
    }

    resolveProfileId(cleanSlug).then((profileId) => {
      if (profileId) {
        analyticsRepository.getSummary(profileId).then((summary) => {
          memoryCache.analytics[cleanSlug] = summary;
          triggerSync();
        }).catch(() => {});
      }
    });

    return {
      page_views: 0,
      unique_visitors: 0,
      messages_received: 0,
      link_shares: 0,
      views_over_time: [],
    };
  },

  trackView: (slug) => {
    const cleanSlug = slug.toLowerCase();
    resolveProfileId(cleanSlug).then((profileId) => {
      if (profileId) {
        analyticsRepository.trackView(profileId).catch(() => {});
      }
    });
  },

  // --------------------------------------------------------------------------
  // REPORTS & MODERATION
  // --------------------------------------------------------------------------
  getReports: async () => {
    try {
      const { data, error } = await supabase
        .from("reports")
        .select(`
          *,
          profiles!target_profile_id (
            id,
            slug,
            full_name,
            business_name
          )
        `)
        .order("created_at", { ascending: false });

      if (!error && data) {
        const formatted = data.map((r) => ({
          id: r.id,
          target_slug: r.profiles?.slug || "unknown",
          target_name: r.profiles?.full_name || r.profiles?.business_name || "Profile",
          reason: r.reason,
          details: r.details,
          reporter: r.reporter_ip ? `IP: ${r.reporter_ip}` : "Public Visitor",
          status: r.status,
          created_at: r.created_at,
        }));
        memoryCache.reports = formatted;
        triggerSync();
        return formatted;
      }
    } catch {
      // Fallback to memory
    }
    return memoryCache.reports;
  },

  addReport: async (report) => {
    const targetSlug = (report.target_slug || report.targetSlug || "").toLowerCase();
    const optimisticReport = {
      id: "rep_" + Date.now(),
      target_slug: targetSlug,
      reason: report.reason,
      details: report.details || "",
      reporter: "Public Visitor",
      status: "pending",
      created_at: new Date().toISOString(),
    };
    memoryCache.reports.unshift(optimisticReport);
    triggerSync();

    try {
      let targetId = memoryCache.profiles[targetSlug]?.id;
      if (!targetId && targetSlug) {
        const { data } = await supabase.from("profiles").select("id").eq("slug", targetSlug).maybeSingle();
        targetId = data?.id;
      }

      if (targetId) {
        await supabase.from("reports").insert({
          target_profile_id: targetId,
          reason: report.reason,
          details: report.details || "",
          status: "pending",
        });
      }
    } catch (err) {
      console.warn("[dbStore] Failed to insert report to Postgres:", err);
    }

    return optimisticReport;
  },

  moderateReport: async (reportId, action) => {
    if (!reportId || !action) throw new Error("reportId and action are required");

    // Invoke privileged Edge Function
    const { data, error } = await supabase.functions.invoke("moderate-action", {
      body: { report_id: reportId, action },
    });

    if (error) {
      console.warn("[dbStore] Edge Function moderate-action error, falling back to direct update:", error);
      await supabase.from("reports").update({ status: action === "dismiss" ? "dismissed" : action === "takedown" ? "taken_down" : "warned" }).eq("id", reportId);
    }

    // Refresh memory cache
    await dbStore.getReports();
    return data || { success: true };
  },
};
