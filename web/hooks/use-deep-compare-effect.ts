/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

// Code adapted from: https://www.usehooks.io/docs/use-deep-compare-effect

import {
  useEffect,
  useRef,
  type EffectCallback,
  type Inputs,
} from "preact/hooks";

export function useDeepCompareEffect(
  effect: EffectCallback,
  deps?: Inputs,
): void {
  const memoizedDeps = useDeepCompareMemoize(deps);

  useEffect(effect, memoizedDeps);
}

function useDeepCompareMemoize(value: Inputs | undefined) {
  const ref = useRef<Inputs | undefined>(undefined);

  if (!deepEqual(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

// TODO: Move this to js utils?
export function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;

  if (a == null || b == null) return a === b;

  if (typeof a !== typeof b) return false;

  if (typeof a !== "object") return a === b;

  if (Array.isArray(a) !== Array.isArray(b)) return false;

  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }

  return true;
}
