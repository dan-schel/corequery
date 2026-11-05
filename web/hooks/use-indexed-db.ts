import { useCallback, useMemo } from "preact/hooks";
import type { z, ZodType } from "zod";

const storeName = "cache";
const cacheKey = "data";

export function useIndexedDb<Schema extends ZodType>(
  key: string,
  schema: Schema,
) {
  const get = useCallback(async (): Promise<z.output<Schema> | null> => {
    try {
      const item = await read(key);
      if (item == null) return null;

      return schema.parse(item);
    } catch {
      return null;
    }
  }, [key, schema]);

  const set = useCallback(
    async (value: z.input<Schema>): Promise<void> => {
      await write(key, value);
    },
    [key],
  );

  return useMemo(() => ({ get, set }), [get, set]);
}

async function read(key: string) {
  const database = await openDatabase(key);

  try {
    return await new Promise<unknown>((resolve, reject) => {
      const transaction = database.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.get(cacheKey);
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
      const transaction = database.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      store.put(value, cacheKey);
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
    request.onupgradeneeded = () => request.result.createObjectStore(storeName);

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
