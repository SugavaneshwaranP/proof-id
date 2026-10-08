// ============================================================================
// BROWSER STORAGE STRATEGY — LOCAL STORAGE MODULE
// Holds low-stakes, non-secret UI preferences that survive across visits.
// ============================================================================

const STORAGE_KEYS = {
  THEME: "backed_theme",
  LAST_DASHBOARD_TAB: "backed_last_dashboard_tab",
  DISMISSED_TIPS: "backed_dismissed_tips",
  REFERRAL_TAG: "backed_referral_tag",
  VISITOR_CONTACT_INFO: "backed_visitor_contact_info",
};

export const localStorageUtil = {
  // Theme (light / dark)
  getTheme: () => {
    try {
      return localStorage.getItem(STORAGE_KEYS.THEME) || "light";
    } catch {
      return "light";
    }
  },

  setTheme: (theme) => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (e) {
      console.warn("LocalStorage unavailable", e);
    }
  },

  // Last opened dashboard tab
  getLastDashboardTab: () => {
    try {
      return localStorage.getItem(STORAGE_KEYS.LAST_DASHBOARD_TAB) || "overview";
    } catch {
      return "overview";
    }
  },

  setLastDashboardTab: (tabId) => {
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_DASHBOARD_TAB, tabId);
    } catch (e) {
      console.warn("LocalStorage unavailable", e);
    }
  },

  // Dismissed tips flags ("don't show this tip again")
  isTipDismissed: (tipId) => {
    try {
      const tips = JSON.parse(localStorage.getItem(STORAGE_KEYS.DISMISSED_TIPS) || "{}");
      return !!tips[tipId];
    } catch {
      return false;
    }
  },

  dismissTip: (tipId) => {
    try {
      const tips = JSON.parse(localStorage.getItem(STORAGE_KEYS.DISMISSED_TIPS) || "{}");
      tips[tipId] = true;
      localStorage.setItem(STORAGE_KEYS.DISMISSED_TIPS, JSON.stringify(tips));
    } catch (e) {
      console.warn("LocalStorage unavailable", e);
    }
  },

  // Pre-signup referral tag
  getReferralTag: () => {
    try {
      return localStorage.getItem(STORAGE_KEYS.REFERRAL_TAG) || null;
    } catch {
      return null;
    }
  },

  setReferralTag: (tag) => {
    try {
      localStorage.setItem(STORAGE_KEYS.REFERRAL_TAG, tag);
    } catch (e) {
      console.warn("LocalStorage unavailable", e);
    }
  },

  clearReferralTag: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.REFERRAL_TAG);
    } catch (e) {
      console.warn("LocalStorage unavailable", e);
    }
  },

  // Pre-filled contact form details for repeat visitors
  getVisitorContactInfo: () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.VISITOR_CONTACT_INFO) || "{}");
    } catch {
      return {};
    }
  },

  setVisitorContactInfo: (info) => {
    try {
      localStorage.setItem(STORAGE_KEYS.VISITOR_CONTACT_INFO, JSON.stringify(info));
    } catch (e) {
      console.warn("LocalStorage unavailable", e);
    }
  },
};
