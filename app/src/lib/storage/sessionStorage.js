// ============================================================================
// BROWSER STORAGE STRATEGY — SESSION STORAGE MODULE
// Holds transient state meant to vanish when the browser tab closes.
// ============================================================================

const SESSION_KEYS = {
  ONBOARDING_STEP: "backed_onboarding_step",
  DISCOVER_FILTERS: "backed_discover_filters",
  JUST_PUBLISHED_FLAG: "backed_just_published_flag",
};

export const sessionStorageUtil = {
  // Onboarding wizard current step & draft state
  getOnboardingState: () => {
    try {
      const data = sessionStorage.getItem(SESSION_KEYS.ONBOARDING_STEP);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setOnboardingState: (state) => {
    try {
      sessionStorage.setItem(SESSION_KEYS.ONBOARDING_STEP, JSON.stringify(state));
    } catch (e) {
      console.warn("SessionStorage unavailable", e);
    }
  },

  clearOnboardingState: () => {
    try {
      sessionStorage.removeItem(SESSION_KEYS.ONBOARDING_STEP);
    } catch (e) {
      console.warn("SessionStorage unavailable", e);
    }
  },

  // Discover page active search & filters
  getDiscoverFilters: () => {
    try {
      const data = sessionStorage.getItem(SESSION_KEYS.DISCOVER_FILTERS);
      return data ? JSON.parse(data) : { query: "", category: "all", location: "", availability: "all" };
    } catch {
      return { query: "", category: "all", location: "", availability: "all" };
    }
  },

  setDiscoverFilters: (filters) => {
    try {
      sessionStorage.setItem(SESSION_KEYS.DISCOVER_FILTERS, JSON.stringify(filters));
    } catch (e) {
      console.warn("SessionStorage unavailable", e);
    }
  },

  // One-time "just published" flag for triggering confetti celebration
  getJustPublishedFlag: () => {
    try {
      return sessionStorage.getItem(SESSION_KEYS.JUST_PUBLISHED_FLAG) === "true";
    } catch {
      return false;
    }
  },

  setJustPublishedFlag: () => {
    try {
      sessionStorage.setItem(SESSION_KEYS.JUST_PUBLISHED_FLAG, "true");
    } catch (e) {
      console.warn("SessionStorage unavailable", e);
    }
  },

  consumeJustPublishedFlag: () => {
    try {
      const isJustPublished = sessionStorage.getItem(SESSION_KEYS.JUST_PUBLISHED_FLAG) === "true";
      sessionStorage.removeItem(SESSION_KEYS.JUST_PUBLISHED_FLAG);
      return isJustPublished;
    } catch {
      return false;
    }
  },
};
