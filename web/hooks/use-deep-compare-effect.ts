/* eslint-disable react-hooks/exhaustive-deps */

// Code adapted from: https://www.usehooks.io/docs/use-deep-compare-effect

import { deepEquals } from "@dan-schel/js-utils";
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

  if (!deepEquals(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}
