/**
 * geoJsonCache.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Global singleton cache for GeoJSON files.
 *
 * Why this exists:
 *  - GeoJSON files (province/district/subdistrict) are large (~MB each).
 *  - Without caching, every map mount re-downloads all 3 files from GitHub CDN.
 *  - At 100k users this means millions of redundant fetches.
 *  - This module stores the parsed GeoJSON in module-level memory so it is
 *    fetched once per browser session and instantly available on subsequent
 *    map mounts (navigation, hot-module-replacement, etc.).
 *
 * Usage:
 *   const geojson = await geoJsonCache.get(THAILAND_GEOJSON_URL);
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GeoJson = any;

// In-memory store: URL → resolved GeoJSON
const store = new Map<string, GeoJson>();

// In-flight store: URL → pending Promise (prevents duplicate simultaneous fetches)
const inflight = new Map<string, Promise<GeoJson>>();

async function fetchAndCache(url: string): Promise<GeoJson> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GeoJSON fetch failed: ${res.status} ${url}`);
  const data: GeoJson = await res.json();
  store.set(url, data);
  inflight.delete(url);
  return data;
}

export const geoJsonCache = {
  /**
   * Returns the GeoJSON for `url`.
   * - Instant if already cached.
   * - Deduplicates concurrent calls (only one network request even if called
   *   simultaneously from multiple mount effects).
   */
  get(url: string): Promise<GeoJson> {
    // 1. Cache hit — return immediately
    const cached = store.get(url);
    if (cached) return Promise.resolve(cached);

    // 2. Already fetching — join the promise
    const pending = inflight.get(url);
    if (pending) return pending;

    // 3. New fetch
    const promise = fetchAndCache(url);
    inflight.set(url, promise);
    return promise;
  },

  /** Pre-warm the cache for a list of URLs (fire-and-forget). */
  prewarm(urls: string[]): void {
    urls.forEach((url) => {
      if (!store.has(url) && !inflight.has(url)) {
        this.get(url).catch(() => {}); // Ignore errors during prewarm
      }
    });
  },

  /** Number of cached entries (useful for debugging). */
  size(): number {
    return store.size;
  },
};
