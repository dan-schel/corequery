import { useCallback, useMemo } from "preact/hooks";
import type { z, ZodType } from "zod";

// The browser cache API is annoying because:
//
// - It only works in secure contexts (so not over LAN HTTP).
//
// - Firefox doesn't seem to have a way to preview the values of cache items,
//   you can only see the keys. Chrome lets you see the values, but you can't
//   edit them.
//
// - It's keyed by URL, so I have to transform the keys into fake URLs for each
//   entry.
//
// But...
//
// - Unlike local storage, it can store >5 MB of data (can comfortably do a
//   few GBs - see "On-device storage" section of Developer Info page).
//
// - Unlike IndexedDB, storing large blobs of JSON is presumably its designed
//   use case. (If using IndexedDB, I'd presumably try to store the whole JSON
//   blob into a single row, and I don't know if it's really designed to be used
//   that way, or whether there's some undocumented row size limit that I'd
//   eventually hit).

const cacheName = "corequery-local-cache";

export function useBrowserCache<Schema extends ZodType>(
  key: string,
  schema: Schema,
) {
  const get = useCallback(async (): Promise<z.output<Schema> | null> => {
    try {
      const cache = await caches.open(cacheName);
      const item = await cache.match(createCacheUrl(key));
      if (item == null) return null;

      return schema.parse(await item.json());
    } catch (e) {
      console.warn(`Failed to parse "${key}" in browser cache.`, e);
      return null;
    }
  }, [key, schema]);

  const set = useCallback(
    async (value: z.input<Schema>): Promise<void> => {
      try {
        const cache = await caches.open(cacheName);
        await cache.put(createCacheUrl(key), Response.json(value));
      } catch (e) {
        console.warn(`Failed to write "${key}" to browser cache.`, e);
      }
    },
    [key],
  );

  return useMemo(() => ({ get, set }), [get, set]);
}

function createCacheUrl(key: string): string {
  // This is not a real URL the server would respond to, we just need a URL to
  // use for the cache key.
  return new URL(
    `/corequery-local-cache/${encodeURIComponent(key)}.json`,
    window.location.origin,
  ).href;
}
