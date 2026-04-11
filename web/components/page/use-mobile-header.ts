import type { ComponentChildren } from "preact";
import { createContext } from "preact";
import { useContext, useLayoutEffect, useState } from "preact/hooks";

type MobileHeaderState = {
  mobileHeader: ComponentChildren | null;
  setMobileHeader: (value: ComponentChildren | null) => void;
};

const MobileHeaderContext = createContext<MobileHeaderState>({
  mobileHeader: null,
  setMobileHeader: () => {},
});

export function useMobileHeaderState() {
  const [mobileHeader, setMobileHeader] = useState<ComponentChildren | null>(
    null,
  );
  return { mobileHeader, setMobileHeader };
}

export const MobileHeaderProvider = MobileHeaderContext.Provider;

export function useMobileHeader() {
  return useContext(MobileHeaderContext).mobileHeader;
}

export function useSetMobileHeader(value: ComponentChildren | null) {
  const { setMobileHeader } = useContext(MobileHeaderContext);

  useLayoutEffect(() => {
    setMobileHeader(value);
    return () => setMobileHeader(null);
  }, [value, setMobileHeader]);
}
