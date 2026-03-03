import { useCallback, useMemo } from "preact/hooks";
import type { z, ZodType } from "zod";

export function useLocalStorage<Schema extends ZodType>(
  key: string,
  schema: Schema,
) {
  const get = useCallback(() => {
    const item = localStorage.getItem(key);
    if (item == null) return null;
    try {
      return schema.parse(JSON.parse(item));
    } catch {
      return null;
    }
  }, [key, schema]);

  const set = useCallback(
    (value: z.input<Schema>) => {
      const stringified = JSON.stringify(value);
      localStorage.setItem(key, stringified);
    },
    [key],
  );

  return useMemo(() => ({ get, set }), [get, set]);
}
