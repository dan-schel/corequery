import { createContext } from "preact";
import { useContext } from "preact/hooks";
import type { Settings } from "@/web/data/settings";
import type { FoundationalData } from "@/web/data/foundational-data";

export type UpdateSettingsFunction = (
  update: (current: Settings) => Settings,
  options?: { persist?: boolean },
) => void;

type SettingsContextValue = {
  readonly settings: Settings;
  readonly updateSettings: UpdateSettingsFunction;
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
