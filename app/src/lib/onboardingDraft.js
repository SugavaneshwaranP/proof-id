// ============================================================================
// ONBOARDING DRAFT STATE MANAGER
// Ensures first-time users can save draft state at every step without losing input (Criterion 1 & 2)
// ============================================================================

const DRAFT_STORAGE_KEY = 'backed_onboarding_draft_v1';

export const DEFAULT_DRAFT = {
  profileType: 'person', // 'person' | 'business'
  slug: 'alexrivera',
  fullName: 'Alex Rivera',
  headline: 'Backend developer who ships fast',
  location: 'San Francisco, CA',
  bio: 'Building resilient microservices, distributed ledger verifications, and high-performance Rust web backends.',
  contactMethod: 'alex@backed.network', // Crucial for Criterion 3: Minimum Credible Publishing
  photoUrl: '/avatar_hero.png',
  businessName: 'Apex Precision Dynamics LLC',
  whatYouDo: 'Contract manufacturer specializing in sub-micron tolerance CNC milling',
  operatingRegions: 'North America, EU, Japan',
  logoPreview: '🏢',
  capabilities: ['Backend Systems', 'Rust Architecture', 'API Verification'],
  proofList: [
    {
      id: 1,
      title: 'E-commerce site for a local bakery',
      linkOrFile: 'https://github.com/alexrivera/bakery-storefront',
      dateHappened: 'June 2025',
      type: 'Project Artifact'
    }
  ],
  stepIndex: 1,
  lastSaved: new Date().toISOString()
};

export function getOnboardingDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(DEFAULT_DRAFT));
      return { ...DEFAULT_DRAFT };
    }
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_DRAFT, ...parsed };
  } catch (e) {
    console.warn('Failed to parse onboarding draft from localStorage:', e);
    return { ...DEFAULT_DRAFT };
  }
}

export function saveOnboardingDraft(updates) {
  try {
    const current = getOnboardingDraft();
    const updated = {
      ...current,
      ...updates,
      lastSaved: new Date().toISOString()
    };
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('backed-draft-updated', { detail: updated }));
    return updated;
  } catch (e) {
    console.warn('Failed to save onboarding draft:', e);
    return null;
  }
}

export function clearOnboardingDraft() {
  try {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('backed-draft-updated', { detail: DEFAULT_DRAFT }));
  } catch (e) {
    console.warn('Failed to clear onboarding draft:', e);
  }
}

export function onDraftSync(callback) {
  const handler = (e) => callback(e.detail);
  window.addEventListener('backed-draft-updated', handler);
  return () => window.removeEventListener('backed-draft-updated', handler);
}
