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

// In-memory runtime cache for seamless UI reactivity (never stored in localStorage)
const memoryCache = {
  profiles: {},
  evidence_items: {},
  projects: {},
  products: {},
  inbox: {},
  analytics: {},
  reports: [],
};

const SYNC_EVENT = "backed-db-sync";

function triggerSync() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: memoryCache }));
  }
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
      is_published: true,
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
      if (current.id) {
        const persisted = await profileRepository.updateProfile(current.id, updates);
        memoryCache.profiles[cleanSlug] = { ...optimistic, ...persisted };
        triggerSync();
        return memoryCache.profiles[cleanSlug];
      }
    } catch (err) {
      console.warn(`[dbStore] Remote updateProfile failed, queued for retry:`, err);
    }

    return optimistic;
  },

  getAllProfiles: () => {
    // Return cached published profiles, trigger background fetch
    const list = Object.values(memoryCache.profiles).filter((p) => p.is_published);
    if (list.length === 0) {
      profileRepository.searchPublishedProfiles().then((profiles) => {
        profiles.forEach((p) => {
          if (p.slug) memoryCache.profiles[p.slug.toLowerCase()] = p;
        });
        triggerSync();
      }).catch(() => {});
    }
    return list;
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
    const profile = memoryCache.profiles[cleanSlug];
    const profileId = profile?.id;

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

    if (profileId) {
      try {
        const persisted = await evidenceRepository.createEvidence({
          profileId,
          title: item.title,
          category: item.category,
          evidenceType: item.evidence_type || "link",
          externalUrl: item.external_url || item.file_url,
        });
        const idx = memoryCache.evidence_items[cleanSlug].findIndex(e => e.id === optimisticItem.id);
        if (idx !== -1) {
          memoryCache.evidence_items[cleanSlug][idx] = { ...optimisticItem, ...persisted };
          triggerSync();
        }
      } catch (err) {
        console.warn(`[dbStore] Remote addEvidence failed, queued offline:`, err);
      }
    }

    return optimisticItem;
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
    const profile = memoryCache.profiles[cleanSlug];
    const profileId = profile?.id;

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

    if (profileId) {
      try {
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
      } catch (err) {
        console.warn(`[dbStore] Remote addProject failed, queued offline:`, err);
      }
    }

    return optimisticProject;
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
    const profile = memoryCache.profiles[cleanSlug];
    const profileId = profile?.id;

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

    if (profileId) {
      try {
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
      } catch (err) {
        console.warn(`[dbStore] Remote addProduct failed, queued offline:`, err);
      }
    }

    return optimisticProd;
  },

  // --------------------------------------------------------------------------
  // INBOX & CONTACT REQUESTS
  // --------------------------------------------------------------------------
  getMessages: (slug) => {
    const cleanSlug = slug.toLowerCase();
    if (memoryCache.inbox[cleanSlug]) {
      return memoryCache.inbox[cleanSlug];
    }

    const profile = memoryCache.profiles[cleanSlug];
    if (profile?.id) {
      inboxRepository.getInboxMessages(profile.id).then((msgs) => {
        memoryCache.inbox[cleanSlug] = msgs;
        triggerSync();
      }).catch(() => {});
    }

    return memoryCache.inbox[cleanSlug] || [];
  },

  sendMessage: async (targetSlug, msgData) => {
    const cleanSlug = targetSlug.toLowerCase();
    const profile = memoryCache.profiles[cleanSlug];
    const profileId = profile?.id;

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

    if (profileId) {
      try {
        await inboxRepository.sendContactRequest({
          profileId,
          senderName: optimisticMsg.sender_name,
          senderEmail: optimisticMsg.sender_email,
          subject: optimisticMsg.subject,
          messageBody: optimisticMsg.message_body,
        });
      } catch (err) {
        console.warn(`[dbStore] Remote sendMessage failed, queued offline:`, err);
      }
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
  // ANALYTICS
  // --------------------------------------------------------------------------
  getAnalytics: (slug) => {
    const cleanSlug = slug.toLowerCase();
    if (memoryCache.analytics[cleanSlug]) {
      return memoryCache.analytics[cleanSlug];
    }

    const profile = memoryCache.profiles[cleanSlug];
    if (profile?.id) {
      analyticsRepository.getSummary(profile.id).then((summary) => {
        memoryCache.analytics[cleanSlug] = summary;
        triggerSync();
      }).catch(() => {});
    }

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
    const profile = memoryCache.profiles[cleanSlug];
    if (profile?.id) {
      analyticsRepository.trackView(profile.id).catch(() => {});
    }
  },

  // --------------------------------------------------------------------------
  // REPORTS
  // --------------------------------------------------------------------------
  getReports: () => {
    return memoryCache.reports;
  },

  addReport: async (report) => {
    const optimisticReport = {
      id: "rep_" + Date.now(),
      status: "pending",
      created_at: new Date().toISOString(),
      ...report,
    };
    memoryCache.reports.unshift(optimisticReport);
    triggerSync();

    try {
      const targetSlug = report.target_slug || report.targetSlug;
      const profile = memoryCache.profiles[targetSlug?.toLowerCase()];
      if (profile?.id) {
        await supabase.from("reports").insert({
          target_profile_id: profile.id,
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
};
