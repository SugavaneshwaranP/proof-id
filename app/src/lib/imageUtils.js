/**
 * Image optimization & pre-scaling utilities for high-performance rendering.
 * Enforces pre-scaled dimensions and web formats to meet <1.5s mobile network load budget.
 */

export function getPreScaledImageUrl(url, width = 200, height = 200) {
  if (!url) {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=user&size=${width}`;
  }

  // Handle Unsplash dynamic image resizing
  if (url.includes('images.unsplash.com')) {
    // Strip existing width/height/quality query params and attach optimal responsive params
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?auto=format&fit=crop&q=80&w=${width}&h=${height}`;
  }

  // Handle DiceBear SVG avatars
  if (url.includes('api.dicebear.com')) {
    return url;
  }

  // Default passthrough for local or other URLs
  return url;
}

export function getOptimizedBannerUrl(url, width = 800) {
  if (!url) return '';
  if (url.includes('images.unsplash.com')) {
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?auto=format&fit=crop&q=80&w=${width}&h=${Math.round(width * 0.35)}`;
  }
  return url;
}
