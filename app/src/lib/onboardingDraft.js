// ============================================================================
// ONBOARDING DRAFT STATE MANAGER
// Pure user real-time draft storage. Zero template or predefined fake data.
// ============================================================================

import { authService } from "./authService";

const DRAFT_STORAGE_KEY = "backed_onboarding_draft_v1";

export function getDefaultDraft() {
  const currentUser = authService.getCurrentUser();
  const email = currentUser?.email || "";
  const fullName = currentUser?.fullName && currentUser.fullName !== "User" ? currentUser.fullName : "";
  const slug = currentUser?.slug && currentUser.slug !== "alexrivera" ? currentUser.slug : (fullName ? fullName.toLowerCase().replace(/[^a-z0-9_-]/g, "") : "");

  return {
    profileType: currentUser?.profileType || "person", // 'person' | 'business'
    slug: slug,
    fullName: fullName,
    headline: "",
    location: "",
    bio: "",
    contactMethod: email,
    photoUrl: currentUser?.avatarUrl || "/avatar_hero.png",
    businessName: "",
    whatYouDo: "",
    operatingRegions: "",
    logoPreview: "🏢",
    capabilities: [],
    proofList: [],
    stepIndex: 1,
    lastSaved: new Date().toISOString(),
  };
}

export function getOnboardingDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    const defaults = getDefaultDraft();
    if (!raw) {
      return defaults;
    }
    const parsed = JSON.parse(raw);
    return { ...defaults, ...parsed };
  } catch (e) {
    console.warn("Failed to parse onboarding draft from localStorage:", e);
    return getDefaultDraft();
  }
}

export function saveOnboardingDraft(updates) {
  try {
    const current = getOnboardingDraft();
    const updated = {
      ...current,
      ...updates,
      lastSaved: new Date().toISOString(),
    };
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("backed-draft-updated", { detail: updated }));
    return updated;
  } catch (e) {
    console.warn("Failed to save onboarding draft to localStorage:", e);
    return updates;
  }
}

export function clearOnboardingDraft() {
  try {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("backed-draft-cleared"));
  } catch (e) {
    console.warn("Failed to clear onboarding draft:", e);
  }
}
