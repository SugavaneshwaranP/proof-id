// ============================================================================
// BROWSER STORAGE STRATEGY — CACHE API MODULE & SERVICE WORKER REGISTRATION
// Scope: App shell caching & stale-while-revalidate public profile caching.
// ============================================================================

const CACHE_NAME = "backed-shell-v1";
const PUBLIC_PROFILE_CACHE = "backed-public-profiles-v1";

export const cacheAPIUtil = {
  // Register Service Worker for Cache API support
  registerServiceWorker: async () => {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js");
        console.log("[SW Registered] Scope:", registration.scope);
      } catch (err) {
        console.warn("[SW Registration Failed]", err);
      }
    }
  },

  // Cache public profile HTML or JSON response for stale-while-revalidate offline preview
  cachePublicProfile: async (slug, data) => {
    if (!("caches" in window)) return;
    try {
      const cache = await caches.open(PUBLIC_PROFILE_CACHE);
      const response = new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json", "X-Cache-Time": new Date().toISOString() },
      });
      await cache.put(`/api/public-profile/${slug}`, response);
    } catch (err) {
      console.warn("Cache API put error:", err);
    }
  },

  getCachedPublicProfile: async (slug) => {
    if (!("caches" in window)) return null;
    try {
      const cache = await caches.open(PUBLIC_PROFILE_CACHE);
      const response = await cache.match(`/api/public-profile/${slug}`);
      if (response) {
        return await response.json();
      }
      return null;
    } catch {
      return null;
    }
  },
};
