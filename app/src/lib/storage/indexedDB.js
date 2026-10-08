// ============================================================================
// BROWSER STORAGE STRATEGY — INDEXEDDB MODULE
// Built for structured, sizeable transactional data: autosaved drafts,
// local copies of projects/products for instant paint, and offline queues.
// ============================================================================

const DB_NAME = "BackedDB";
const DB_VERSION = 1;

const STORES = {
  DRAFTS: "form_drafts",
  PROJECTS: "projects_cache",
  PRODUCTS: "products_cache",
  OFFLINE_QUEUE: "offline_queue",
};

function openDB() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error("IndexedDB not supported by browser environment"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORES.DRAFTS)) {
        db.createObjectStore(STORES.DRAFTS, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORES.PROJECTS)) {
        db.createObjectStore(STORES.PROJECTS, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORES.PRODUCTS)) {
        db.createObjectStore(STORES.PRODUCTS, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORES.OFFLINE_QUEUE)) {
        db.createObjectStore(STORES.OFFLINE_QUEUE, { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export const indexedDBUtil = {
  // Save form draft (e.g. Profile or Evidence Form)
  saveDraft: async (formKey, draftData) => {
    try {
      const db = await openDB();
      const tx = db.transaction(STORES.DRAFTS, "readwrite");
      tx.objectStore(STORES.DRAFTS).put({
        id: formKey,
        data: draftData,
        updatedAt: Date.now(),
      });
      return new Promise((resolve) => (tx.oncomplete = resolve));
    } catch (err) {
      console.warn("IndexedDB saveDraft error:", err);
    }
  },

  getDraft: async (formKey) => {
    try {
      const db = await openDB();
      const tx = db.transaction(STORES.DRAFTS, "readonly");
      const req = tx.objectStore(STORES.DRAFTS).get(formKey);
      return new Promise((resolve) => {
        req.onsuccess = () => resolve(req.result ? req.result.data : null);
        req.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  },

  clearDraft: async (formKey) => {
    try {
      const db = await openDB();
      const tx = db.transaction(STORES.DRAFTS, "readwrite");
      tx.objectStore(STORES.DRAFTS).delete(formKey);
      return new Promise((resolve) => (tx.oncomplete = resolve));
    } catch (err) {
      console.warn("IndexedDB clearDraft error:", err);
    }
  },

  // Projects cache for instant UI paint
  cacheProjects: async (projects) => {
    try {
      const db = await openDB();
      const tx = db.transaction(STORES.PROJECTS, "readwrite");
      const store = tx.objectStore(STORES.PROJECTS);
      store.clear();
      projects.forEach((proj) => store.put(proj));
      return new Promise((resolve) => (tx.oncomplete = resolve));
    } catch (err) {
      console.warn("IndexedDB cacheProjects error:", err);
    }
  },

  getCachedProjects: async () => {
    try {
      const db = await openDB();
      const tx = db.transaction(STORES.PROJECTS, "readonly");
      const req = tx.objectStore(STORES.PROJECTS).getAll();
      return new Promise((resolve) => {
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
    } catch {
      return [];
    }
  },

  // Queue offline operation
  enqueueOfflineAction: async (actionType, payload) => {
    try {
      const db = await openDB();
      const tx = db.transaction(STORES.OFFLINE_QUEUE, "readwrite");
      tx.objectStore(STORES.OFFLINE_QUEUE).add({
        actionType,
        payload,
        timestamp: Date.now(),
      });
      return new Promise((resolve) => (tx.oncomplete = resolve));
    } catch (err) {
      console.warn("IndexedDB enqueueOfflineAction error:", err);
    }
  },

  getOfflineQueue: async () => {
    try {
      const db = await openDB();
      const tx = db.transaction(STORES.OFFLINE_QUEUE, "readonly");
      const req = tx.objectStore(STORES.OFFLINE_QUEUE).getAll();
      return new Promise((resolve) => {
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
    } catch {
      return [];
    }
  },

  clearOfflineQueue: async () => {
    try {
      const db = await openDB();
      const tx = db.transaction(STORES.OFFLINE_QUEUE, "readwrite");
      tx.objectStore(STORES.OFFLINE_QUEUE).clear();
      return new Promise((resolve) => (tx.oncomplete = resolve));
    } catch (err) {
      console.warn("IndexedDB clearOfflineQueue error:", err);
    }
  },
};
