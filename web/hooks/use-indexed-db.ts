import { useCallback, useMemo } from "preact/hooks";
import type { z, ZodType } from "zod";

// Neither of these are the top-level database name, the `key` passed to the
// hook is. Within each database is a single table ("cache"), with a single row
// ("data").
const tableName = "cache";
const rowId = "data";

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
