import { createContext } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";

type MobileHeaderState = {
  hasMobileHeader: boolean;
  setHasMobileHeader: (value: boolean) => void;
};

const MobileHeaderContext = createContext<MobileHeaderState>({
  hasMobileHeader: false,
  setHasMobileHeader: () => {},
});

export function useMobileHeaderState() {
  const [hasMobileHeader, setHasMobileHeader] = useState(false);
  return { hasMobileHeader, setHasMobileHeader };
}

export const MobileHeaderProvider = MobileHeaderContext.Provider;

export function useHasMobileHeader() {
  return useContext(MobileHeaderContext).hasMobileHeader;
}

export function useSetMobileHeader(value: boolean) {
  const { setHasMobileHeader } = useContext(MobileHeaderContext);

  useEffect(() => {
    setHasMobileHeader(value);
  }, [value, setHasMobileHeader]);
}
