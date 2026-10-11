// ============================================================================
// BACKED — UNIFIED DATABASE & REACTIVE STORE LAYER
// Connects Frontend UI -> Service API Layer -> Database / RPC / Reactive Store
// ============================================================================

import { broadcastActivityEvent, broadcastEvidenceStatusUpdate, broadcastInboxMessage } from "./realtime";
import { supabase } from "./supabaseClient";

const DB_STORAGE_KEY = "backed_database_v1";

const INITIAL_DB = {
  profiles: {
    alexrivera: {
      id: "prof_alexrivera",
      slug: "alexrivera",
      profile_type: "person",
      full_name: "Alex Rivera",
      headline: "Staff Product Engineer & Frontend Architect",
      location: "San Francisco, CA",
      bio: "10+ years scaling high-throughput distributed UI systems. Specializing in WebGL, React, Rust-wasm, and real-time state synchronization.",
      avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      banner_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200",
      availability_status: "Open for Advisory & Select Projects",
      is_published: true,
      completion_score: 95,
      github_url: "https://github.com",
      linkedin_url: "https://linkedin.com",
      twitter_url: "https://x.com",
      capabilities: [
        { name: "Frontend Architecture", category: "Engineering", endorsement_count: 14 },
        { name: "Real-time WebSockets", category: "Engineering", endorsement_count: 12 },
        { name: "Design Systems", category: "Product", endorsement_count: 9 },
        { name: "Performance Optimization", category: "Engineering", endorsement_count: 18 },
      ],
      created_at: "2026-01-15T10:00:00Z",
    },
    "apex-dynamics": {
      id: "prof_apexdynamics",
      slug: "apex-dynamics",
      profile_type: "business",
      business_name: "Apex Precision Dynamics LLC",
      headline: "ISO 9001 Certified Aerospace & Industrial Machining",
      location: "Austin, TX",
      bio: "Contract manufacturer specializing in sub-micron tolerance CNC milling, titanium alloys, and rapid aerospace prototyping.",
      avatar_url: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200",
      banner_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200",
      availability_status: "Taking Q4 2026 Production Runs",
      is_published: true,
      completion_score: 100,
      regions_served: ["North America", "European Union", "Japan"],
      payment_terms: "Net 30 / Escrow",
      sample_availability: "Samples dispatched within 48h",
      facility_description: "45,000 sq ft climate-controlled facility with 5-axis DMG MORI CNC machines and Zeiss CMM inspection.",
      capabilities: [
        { name: "5-Axis CNC Milling", category: "Manufacturing", endorsement_count: 32 },
        { name: "Titanium Prototyping", category: "Aerospace", endorsement_count: 27 },
        { name: "Zeiss CMM Inspection", category: "Quality Assurance", endorsement_count: 41 },
      ],
      created_at: "2026-02-01T12:00:00Z",
    }
  },

  evidence_items: [
    {
      id: "ev_101",
      profile_slug: "alexrivera",
      title: "Led Frontend Refactor for High-Frequency Trading Terminal",
      category: "Engineering Work",
      status: "verified",
      verifier_name: "Sarah Chen (VP Eng at QuantFlow)",
      verifier_note: "Confirmed. Alex spearheaded the sub-10ms canvas rendering engine for our flagship product.",
      verifier_token: "token-quantflow-882",
      created_at: "2026-03-10T14:30:00Z",
      file_url: "https://github.com",
    },
    {
      id: "ev_102",
      profile_slug: "alexrivera",
      title: "Architected Zero-Knowledge Authentication Flow",
      category: "Security & Crypto",
      status: "verified",
      verifier_name: "Marcus Vance (Principal Architect)",
      verifier_note: "Verified code baseline and security audit logs.",
      verifier_token: "token-99281",
      created_at: "2026-03-22T09:15:00Z",
    },
    {
      id: "ev_201",
      profile_slug: "apex-dynamics",
      title: "ISO 9001:2015 Quality Management System Certification",
      category: "Certification",
      status: "verified",
      verifier_name: "TÜV SÜD America Audit Bureau",
      verifier_note: "Audit Certificate #99281-ISO active through 2028.",
      verifier_token: "token-tuv-9001",
      created_at: "2026-01-20T11:00:00Z",
    }
  ],

  projects: [
    {
      id: "proj_1",
      profile_slug: "alexrivera",
      title: "Ultra-Low Latency Canvas Data Grid",
      description: "60 FPS rendering engine for 100k live dynamic stream rows.",
      role: "Lead Author & Architect",
      status: "Verified",
      year: "2025 - 2026",
      tags: ["React", "WebGL", "TypeScript"],
      link: "https://github.com",
    },
    {
      id: "proj_2",
      profile_slug: "alexrivera",
      title: "Backed Real-time Deterministic Verification Network",
      description: "Cryptographically verified proof badges and peer endorsement protocol.",
      role: "Founder & Lead Developer",
      status: "Verified",
      year: "2026",
      tags: ["React", "Tailwind", "Supabase", "Postgres"],
      link: "https://backed.network",
    }
  ],

  products: [
    {
      id: "prod_1",
      profile_slug: "apex-dynamics",
      title: "Custom Aerospace Titanium Bracket Assembly",
      category: "Aerospace Structural",
      price_range: "$450 - $1,200 per unit",
      lead_time: "7 business days",
      min_order_qty: "10 units",
      description: "5-axis CNC machined Ti-6Al-4V alloy structural bracket with full material certification batch tracking.",
      specs: ["Material: Ti-6Al-4V", "Tolerance: ±0.005mm", "Finish: Anodized Type II"],
      image_url: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=400",
    },
    {
      id: "prod_2",
      profile_slug: "apex-dynamics",
      title: "Precision Micro-Fluidic Manifold Block",
      category: "Medical & Fluidics",
      price_range: "$890 - $2,400 per unit",
      lead_time: "10 business days",
      min_order_qty: "5 units",
      description: "Optical-grade acrylic micro-fluidic manifold with diffusion bonded channels for lab-on-a-chip diagnostics.",
      specs: ["Material: Acrylic / PEEK", "Pressure Rating: 150 PSI", "Channel Size: 200 µm"],
      image_url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400",
    }
  ],

  verifications: [
    {
      id: "verif_1",
      token: "token-99281",
      profile_slug: "alexrivera",
      requester_name: "Alex Rivera",
      claim_text: "I built the checkout flow and zero-knowledge auth system for this project.",
      status: "pending", // pending | confirmed | declined
      created_at: "2026-10-01T08:00:00Z",
    }
  ],

  inbox: [
    {
      id: "msg_1",
      profile_slug: "alexrivera",
      sender_name: "Elena Rostova",
      sender_email: "elena@vanguardvc.com",
      company: "Vanguard Tech Ventures",
      subject: "Advisory & Technical Due Diligence Inquiry",
      message: "Hi Alex, we saw your Backed profile and confirmed engineering proofs. We would love to discuss a 3-month technical advisory engagement for one of our portfolio companies.",
      read: false,
      created_at: "2026-10-08T15:45:00Z",
    },
    {
      id: "msg_2",
      profile_slug: "apex-dynamics",
      sender_name: "David Kim",
      sender_email: "dkim@orbital-systems.io",
      company: "Orbital Systems Inc.",
      subject: "RFP for Titanium Component Batch (500 units)",
      message: "Hello Apex team, please review our attached CAD drawings for a batch run of 500 titanium aerospace housing units. We need delivery by Q1 2027.",
      read: true,
      created_at: "2026-10-07T11:20:00Z",
    }
  ],

  analytics: {
    alexrivera: {
      page_views: 1420,
      unique_visitors: 980,
      messages_received: 14,
      link_shares: 184,
      views_over_time: [
        { date: "Oct 1", views: 42 },
        { date: "Oct 2", views: 68 },
        { date: "Oct 3", views: 95 },
        { date: "Oct 4", views: 112 },
        { date: "Oct 5", views: 140 },
        { date: "Oct 6", views: 210 },
        { date: "Oct 7", views: 285 },
      ]
    },
    "apex-dynamics": {
      page_views: 3410,
      unique_visitors: 2150,
      messages_received: 29,
      link_shares: 410,
      views_over_time: [
        { date: "Oct 1", views: 120 },
        { date: "Oct 2", views: 180 },
        { date: "Oct 3", views: 240 },
        { date: "Oct 4", views: 310 },
        { date: "Oct 5", views: 420 },
        { date: "Oct 6", views: 560 },
        { date: "Oct 7", views: 690 },
      ]
    }
  },

  reports: [
    {
      id: "rep_101",
      target_slug: "unverified-vendor-x",
      reason: "Unsubstantiated ISO compliance claims",
      reporter: "Audit Safety Bot",
      status: "open",
      created_at: "2026-10-09T04:12:00Z",
    }
  ]
};

function getDB() {
  try {
    const raw = localStorage.getItem(DB_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(INITIAL_DB));
      return INITIAL_DB;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DB;
  }
}

function saveDB(db) {
  try {
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(db));
    window.dispatchEvent(new CustomEvent("backed-db-sync", { detail: db }));
  } catch (err) {
    console.warn("Error persisting database store:", err);
  }
}

export const dbStore = {
  // Subscribe to store updates
  onSync: (callback) => {
    const handler = (e) => callback(e.detail);
    window.addEventListener("backed-db-sync", handler);
    return () => window.removeEventListener("backed-db-sync", handler);
  },

  // PROFILES
  getProfile: (slug) => {
    const db = getDB();
    if (db.profiles[slug]) return db.profiles[slug];
    // Dynamic fallback profile generation for new slugs
    return {
      id: `prof_${slug}`,
      slug: slug,
      profile_type: "person",
      full_name: slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      headline: "Verified Professional",
      location: "Global",
      bio: "Welcome to my verified Backed profile. Real proofs, zero fluff.",
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(slug)}`,
      availability_status: "Open for opportunities",
      is_published: true,
      completion_score: 75,
      capabilities: [
        { name: "Strategic Execution", category: "Core", endorsement_count: 5 },
        { name: "Technical Management", category: "Core", endorsement_count: 8 },
      ],
      created_at: new Date().toISOString(),
    };
  },

  updateProfile: (slug, updates) => {
    const db = getDB();
    const current = dbStore.getProfile(slug);
    const updated = { ...current, ...updates, updated_at: new Date().toISOString() };
    db.profiles[slug] = updated;
    saveDB(db);
    return updated;
  },

  getAllProfiles: () => {
    const db = getDB();
    return Object.values(db.profiles).filter(p => p.is_published);
  },

  // EVIDENCE ITEMS
  getEvidence: (slug) => {
    const db = getDB();
    return db.evidence_items.filter(item => item.profile_slug === slug);
  },

  addEvidence: (slug, item) => {
    const db = getDB();
    const newItem = {
      id: "ev_" + Date.now(),
      profile_slug: slug,
      status: "pending",
      verifier_token: "token-" + Math.floor(10000 + Math.random() * 90000),
      created_at: new Date().toISOString(),
      ...item,
    };
    db.evidence_items.unshift(newItem);
    saveDB(db);

    broadcastActivityEvent(slug, {
      type: "verification_requested",
      title: newItem.title,
      token: newItem.verifier_token,
    });

    return newItem;
  },

  updateEvidenceStatus: (tokenOrId, status, verifierNote = "") => {
    const db = getDB();
    const item = db.evidence_items.find(e => e.id === tokenOrId || e.verifier_token === tokenOrId);
    if (item) {
      item.status = status;
      if (verifierNote) item.verifier_note = verifierNote;
      saveDB(db);
      broadcastEvidenceStatusUpdate(item.profile_slug, item);
    }
    return item;
  },

  // PROJECTS
  getProjects: (slug) => {
    const db = getDB();
    return db.projects.filter(p => p.profile_slug === slug);
  },

  addProject: (slug, project) => {
    const db = getDB();
    const newProject = {
      id: "proj_" + Date.now(),
      profile_slug: slug,
      status: "Verified",
      ...project,
    };
    db.projects.unshift(newProject);
    saveDB(db);
    return newProject;
  },

  // PRODUCTS
  getProducts: (slug) => {
    const db = getDB();
    return db.products.filter(p => p.profile_slug === slug);
  },

  addProduct: (slug, product) => {
    const db = getDB();
    const newProd = {
      id: "prod_" + Date.now(),
      profile_slug: slug,
      ...product,
    };
    db.products.unshift(newProd);
    saveDB(db);
    return newProd;
  },

  // INBOX
  getMessages: (slug) => {
    const db = getDB();
    return db.inbox.filter(m => m.profile_slug === slug);
  },

  sendMessage: (targetSlug, msgData) => {
    const db = getDB();
    const newMsg = {
      id: "msg_" + Date.now(),
      profile_slug: targetSlug,
      read: false,
      created_at: new Date().toISOString(),
      ...msgData,
    };
    db.inbox.unshift(newMsg);
    saveDB(db);

    broadcastInboxMessage(targetSlug, newMsg);
    return newMsg;
  },

  markMessageRead: (msgId) => {
    const db = getDB();
    const msg = db.inbox.find(m => m.id === msgId);
    if (msg) {
      msg.read = true;
      saveDB(db);
    }
  },

  // ANALYTICS
  getAnalytics: (slug) => {
    const db = getDB();
    return db.analytics[slug] || {
      page_views: 142,
      unique_visitors: 98,
      messages_received: 4,
      link_shares: 24,
      views_over_time: [
        { date: "Oct 1", views: 10 },
        { date: "Oct 2", views: 25 },
        { date: "Oct 3", views: 40 },
        { date: "Oct 4", views: 65 },
        { date: "Oct 5", views: 90 },
      ]
    };
  },

  trackView: (slug) => {
    const db = getDB();
    if (!db.analytics[slug]) {
      db.analytics[slug] = { page_views: 1, unique_visitors: 1, messages_received: 0, link_shares: 0, views_over_time: [] };
    } else {
      db.analytics[slug].page_views += 1;
    }
    saveDB(db);
  },

  // ADMIN REPORTS
  getReports: () => {
    const db = getDB();
    return db.reports;
  },

  addReport: (report) => {
    const db = getDB();
    const newRep = {
      id: "rep_" + Date.now(),
      status: "open",
      created_at: new Date().toISOString(),
      ...report,
    };
    db.reports.unshift(newRep);
    saveDB(db);
    return newRep;
  }
};
