import { type ComponentChildren } from "preact";
import { useCallback, useMemo, useState } from "preact/hooks";
import { Settings } from "@/web/data/settings";
import { useLocalStorage } from "@/web/hooks/use-local-storage";
import { settingsContext } from "@/web/hooks/use-settings";
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

  const updateSettings = useCallback(
    (newSettings: Settings) => {
      setSettings(newSettings);
      cache.set(newSettings.toJson());
    },
    [cache],
  );

  const revalidateSettings = useCallback(
    (foundationalData: FoundationalData) => {
      // Intentionally don't immediately persist the revalidated settings. We'll
      // persist it once the user changes their settings.
      setSettings((settings) => {
        const newSettings = settings.validate(foundationalData);
        if (!newSettings.equals(settings)) {
          console.warn("Settings updated due to foundational data changes.");
        }
        return newSettings;
      });
    },
    [],
  );

  const value = useMemo(
    () => ({ settings, updateSettings, revalidateSettings }),
    [settings, updateSettings, revalidateSettings],
  );

  return <Provider value={value}>{props.children}</Provider>;
}
