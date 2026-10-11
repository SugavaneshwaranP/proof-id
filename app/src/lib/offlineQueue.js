// ============================================================================
// PROOF-ID / BACKED — INDEXEDDB OFFLINE QUEUE & DRAFT STORE
// Fulfills Rule 14: IndexedDB is used for unsaved drafts and offline retry queue.
// ============================================================================

const DB_NAME = "backed_offline_v1";
const DB_VERSION = 1;
const STORE_DRAFTS = "drafts";
const STORE_MUTATIONS = "mutations_queue";

function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      resolve(null);
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_DRAFTS)) {
        db.createObjectStore(STORE_DRAFTS, { keyPath: "key" });
      }
      if (!db.objectStoreNames.contains(STORE_MUTATIONS)) {
        db.createObjectStore(STORE_MUTATIONS, { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// ----------------------------------------------------------------------------
// Unsaved Draft Operations (IndexedDB)
// ----------------------------------------------------------------------------

export async function saveDraftIndexedDB(key, data) {
  try {
    const db = await openDB();
    if (!db) return false;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_DRAFTS, "readwrite");
      const store = tx.objectStore(STORE_DRAFTS);
      const req = store.put({ key, data, updatedAt: new Date().toISOString() });
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("IndexedDB saveDraft error:", err);
    return false;
  }
}

export async function getDraftIndexedDB(key) {
  try {
    const db = await openDB();
    if (!db) return null;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_DRAFTS, "readonly");
      const store = tx.objectStore(STORE_DRAFTS);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result ? req.result.data : null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("IndexedDB getDraft error:", err);
    return null;
  }
}

export async function clearDraftIndexedDB(key) {
  try {
    const db = await openDB();
    if (!db) return false;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_DRAFTS, "readwrite");
      const store = tx.objectStore(STORE_DRAFTS);
      const req = store.delete(key);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("IndexedDB clearDraft error:", err);
    return false;
  }
}

// ----------------------------------------------------------------------------
// Offline Mutation Queue Operations (IndexedDB)
// ----------------------------------------------------------------------------

export async function enqueueOfflineMutation(mutation) {
  try {
    const db = await openDB();
    if (!db) return false;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_MUTATIONS, "readwrite");
      const store = tx.objectStore(STORE_MUTATIONS);
      const req = store.add({
        ...mutation,
        queuedAt: new Date().toISOString(),
        attempts: 0,
      });
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("Failed to enqueue offline mutation:", err);
    return false;
  }
}

export async function getPendingMutations() {
  try {
    const db = await openDB();
    if (!db) return [];
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_MUTATIONS, "readonly");
      const store = tx.objectStore(STORE_MUTATIONS);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("Failed to get pending mutations:", err);
    return [];
  }
}

export async function removeOfflineMutation(id) {
  try {
    const db = await openDB();
    if (!db) return false;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_MUTATIONS, "readwrite");
      const store = tx.objectStore(STORE_MUTATIONS);
      const req = store.delete(id);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("Failed to remove offline mutation:", err);
    return false;
  }
}
