import { createContext } from "preact";
import { useContext } from "preact/hooks";
import type { FoundationalData } from "@/web/data/foundational-data";

type FoundationalDataContextValue = {
  readonly foda: FoundationalData;
  readonly updateFoda: (newFoda: FoundationalData) => void;
};

export const foundationalDataContext =
  createContext<FoundationalDataContextValue | null>(null);

export function useFoundationalData(): FoundationalDataContextValue {
  const value = useContext(foundationalDataContext);

  if (value == null) {
    throw new Error("Foundational data unavailable outside provider.");
  }

  return value;
}
