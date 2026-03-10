import { useEffect, useState } from "preact/hooks";

/**
 * When `active` becomes `true`, the returned state value becomes `true` after
 * `delayMs` milliseconds. When `active` becomes `false`, this value becomes (or
 * remains) `false` instantly.
 */
export function useActivationDelay(active: boolean, delayMs: number) {
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    if (!active) {
      setActivated(false);
      return;
    }

    const timeout = setTimeout(() => {
      setActivated(true);
    }, delayMs);

    return () => {
      clearTimeout(timeout);
    };
  }, [active, delayMs]);

  return activated;
}
