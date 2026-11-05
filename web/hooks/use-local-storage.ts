import { useCallback, useMemo } from "preact/hooks";
import type { z, ZodType } from "zod";

export function useLocalStorage<Schema extends ZodType>(
  key: string,
  schema: Schema,
) {
  const get = useCallback((): z.output<Schema> | null => {
    try {
      const item = localStorage.getItem(key);
      if (item == null) return null;

      return schema.parse(JSON.parse(item));
    } catch {
      console.warn(`Failed to read "${key}" from local storage.`);
      return null;
    }
  }, [key, schema]);

  const set = useCallback(
    (value: z.input<Schema>) => {
      try {
        const stringified = JSON.stringify(value);
        localStorage.setItem(key, stringified);
      } catch (e) {
        console.warn(`Failed to write "${key}" to local storage.`, e);
      }
    },
    [key],
  );

  return useMemo(() => ({ get, set }), [get, set]);
}
