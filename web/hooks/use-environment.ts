import { useMemo } from "preact/hooks";

export function useEnvironment() {
  const isHotReloadingEnabled = useMemo(() => import.meta.hot != null, []);

  return {
    isHotReloadingEnabled,
  };
}
