import { createContext } from "preact";
import { useContext } from "preact/hooks";
import type { Settings } from "@/web/data/settings";
import type { FoundationalData } from "@/web/data/foundational-data";

export type SettingsContextValue = {
  readonly settings: Settings;
  readonly updateSettings: (newSettings: Settings) => void;
  readonly revalidateSettings: (foundationalData: FoundationalData) => void;
};

export const settingsContext = createContext<SettingsContextValue | null>(null);

export function useSettings(): SettingsContextValue {
  const value = useContext(settingsContext);

  if (value == null) {
    throw new Error("Settings unavailable outside provider.");
  }

  return value;
}
