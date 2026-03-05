import { useLocation } from "preact-iso";
import { useMemo } from "preact/hooks";

export function useNavExemptions() {
  const { url } = useLocation();

  return useMemo(
    () => ({
      // So far, all pages show the mobile nav. Here's where pages can be made
      // exempt. The reason it's done this way (instead of making each page in
      // charge of showing the mobile nav) is so the same mobile nav instance
      // can be shared across navigations without unmounting/remounting.
      showMobileNav: url !== "askdjflhasdfjklhasdflkjhasdflkjhasdlfkjhasdfa",

      // Assume we'll need the same for the desktop nav.
      showDesktopNav: url !== "askdjflhasdfjklhasdflkjhasdflkjhasdlfkjhasdfa",
    }),
    [url],
  );
}
