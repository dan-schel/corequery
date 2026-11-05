import { useCallback, useMemo } from "preact/hooks";
import type { z, ZodType } from "zod";

// Neither of these are the top-level database name, the `key` passed to the
// hook is. Within each database is a single table ("cache"), with a single row
// ("data").
const tableName = "cache";
const rowId = "data";

// TODO: This works, but I'm definitely not using IndexedDB for its intended
// purpose, I'm just shoving a massive JSON object into a single row and hoping
// there's no size limit other than the global storage limit (usually of several
// GBs). While I can't find it documented, it wouldn't be crazy for browsers to
// assume that rows in IndexedDB won't be storing tens of MBs in a single row.
//
// Probably a better fit would be the window.caches API for this use case. It's
// still not perfect, as it expects a request/response pair rather than just
// storing data by key, but I think I can fudge it with Cache.put(), and it's
// probably a closer fit than this IndexedDB approach. Unfortunately, it also
// requires a secure context (HTTPS), which is fine for everything except when I
// want to visit the site on my phone over LAN (localhost is considered secure,
// but not a 192.168.X.X address). Luckily, caching foundational data is not a
// critical path, so as long as we're happy to let it quietly fail (both in
// reading and writing the cache) as we currently do, then it won't impact that
// situation.

export function useIndexedDb<Schema extends ZodType>(
  key: string,
  schema: Schema,
) {
  const get = useCallback(async (): Promise<z.output<Schema> | null> => {
    try {
      const item = await read(key);
      if (item == null) return null;

      return schema.parse(item);
    } catch (e) {
      console.warn(`Failed to read "${key}" from IndexedDB.`, e);
      return null;
    }
  }, [key, schema]);

  const set = useCallback(
    async (value: z.input<Schema>): Promise<void> => {
      try {
        await write(key, value);
      } catch (e) {
        console.warn(`Failed to write "${key}" to IndexedDB.`, e);
      }
    },
    [key],
  );

  return useMemo(() => ({ get, set }), [get, set]);
}

async function read(key: string) {
  const database = await openDatabase(key);

  try {
    return await new Promise<unknown>((resolve, reject) => {
      const transaction = database.transaction(tableName, "readonly");
      const store = transaction.objectStore(tableName);
      const request = store.get(rowId);
      transaction.oncomplete = () => resolve(request.result);
      transaction.onabort = () => reject(transaction.error ?? new Error());
    });
  } finally {
    database.close();
  }
}

async function write(key: string, value: unknown): Promise<void> {
  const database = await openDatabase(key);

  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(tableName, "readwrite");
      const store = transaction.objectStore(tableName);
      store.put(value, rowId);
      transaction.oncomplete = () => resolve();
      transaction.onabort = () => reject(transaction.error ?? new Error());
    });
  } finally {
    database.close();
  }
}

function openDatabase(key: string): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(key);

    // Runs when the DB is first created.
    request.onupgradeneeded = () => request.result.createObjectStore(tableName);

    // There's a world of version numbers and upgrade scenarios in IndexedDB
    // which I'm ignoring here. We're not using versioning at all (our
    // `indexedDB.open` call above doesn't specify a version). We're only using
    // IndexedDB as glorified (not-restricted-to-5MB) local storage anyway. We
    // do our own versioning of sorts by pushing the data we retrieve through
    // the Zod schema and return null if it doesn't parse.
    request.onerror = () => reject(request.error ?? new Error());
    request.onsuccess = () => resolve(request.result);
  });
}
