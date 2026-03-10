import { createContext } from "preact";
import { useContext } from "preact/hooks";
import type { FoundationalData } from "@/web/data/foundational-data";

export const foundationalDataContext = createContext<FoundationalData | null>(
  null,
);

export function useFoundationalData(): FoundationalData {
  const foda = useContext(foundationalDataContext);

  if (foda == null) {
    throw new Error("Foundational data unavailable outside provider.");
  }

  return foda;
}
