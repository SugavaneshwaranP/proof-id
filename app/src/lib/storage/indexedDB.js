// ============================================================================
// BROWSER STORAGE STRATEGY — UNIFIED INDEXEDDB MODULE
// Built for structured, transactional data: autosaved drafts and offline retry queue.
// Delegates directly to offlineQueue.js singleton to ensure single connection pool.
// ============================================================================

import {
  saveDraftIndexedDB,
  getDraftIndexedDB,
  clearDraftIndexedDB,
  enqueueOfflineMutation,
  getPendingMutations,
  removeOfflineMutation,
} from "../offlineQueue";

export const indexedDBUtil = {
  // Save form draft (e.g. Profile or Evidence Form)
  saveDraft: (formKey, draftData) => saveDraftIndexedDB(formKey, draftData),

  // Retrieve form draft
  getDraft: (formKey) => getDraftIndexedDB(formKey),

  // Clear form draft
  clearDraft: (formKey) => clearDraftIndexedDB(formKey),

  // Queue offline operation
  enqueueOfflineAction: (actionType, payload) =>
    enqueueOfflineMutation({ type: actionType, payload }),

  // Get all pending offline operations
  getOfflineQueue: () => getPendingMutations(),

  // Clear offline operations
  clearOfflineQueue: async () => {
    const items = await getPendingMutations();
    await Promise.all(items.map((i) => removeOfflineMutation(i.id)));
  },
};
