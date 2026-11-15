import { createContext } from "preact";
import { useContext } from "preact/hooks";

type NowContextValue = {
  readonly currentMinute: Temporal.Instant;
};

export const nowContext = createContext<NowContextValue | null>(null);

export function useNow(): NowContextValue {
  const value = useContext(nowContext);

  if (value == null) {
    throw new Error("Current time unavailable outside provider.");
  }

  return value;
}
