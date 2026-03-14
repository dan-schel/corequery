import { type ComponentChildren } from "preact";
import { useCallback, useMemo, useState } from "preact/hooks";
import { Settings } from "@/web/data/settings";
import { updateTheme } from "@/web/data/theme";
import { useLocalStorage } from "@/web/hooks/use-local-storage";
import {
  settingsContext,
  type UpdateSettingsFunction,
} from "@/web/hooks/use-settings";
import type { FoundationalData } from "@/web/data/foundational-data";

type SettingsProviderProps = {
  children: ComponentChildren;
};

export function SettingsProvider(props: SettingsProviderProps) {
  const { Provider } = settingsContext;

  const cache = useLocalStorage("corequery-settings", Settings.json);

  const [settings, setSettings] = useState<Settings>(() => {
    const cached = cache.get();
    if (cached != null) return cached;

    console.warn("Failed to load settings, using defaults.");
    return Settings.default;
  });

  const updateSettings = useCallback<UpdateSettingsFunction>(
    (update, options) => {
      setSettings((settings) => {
        const newSettings = update(settings);
        if (options?.persist ?? true) {
          cache.set(newSettings.toJson());
        }
        return newSettings;
      });
      updateTheme();
    },
    [cache],
  );

  const revalidateSettings = useCallback(
    (foundationalData: FoundationalData) => {
      updateSettings(
        (settings) => {
          const newSettings = settings.validate(foundationalData);
          if (!newSettings.equals(settings)) {
            console.warn("Settings updated due to foundational data changes.");
          }
          return newSettings;
        },
        // Intentionally don't immediately persist the revalidated settings.
        // They'll be persisted on the next user initiated update.
        { persist: false },
      );
    },
    [updateSettings],
  );

  const value = useMemo(
    () => ({ settings, updateSettings, revalidateSettings }),
    [settings, updateSettings, revalidateSettings],
  );

  return <Provider value={value}>{props.children}</Provider>;
}
