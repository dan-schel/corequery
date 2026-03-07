import clsx from "clsx";
import { useLocation } from "preact-iso";
import { Grid } from "@/web/components/core/Grid";
import { NavMenu } from "@/web/components/page/NavMenu";
import { useEffect, useState } from "preact/hooks";
import { useNavExemptions } from "@/web/components/page/use-nav-exemptions";
import { MobileNavBar } from "@/web/components/page/MobileNavBar";
import { DesktopNavBar } from "@/web/components/page/DesktopNavBar";

type NavProps = {
  class?: string;
};

export function Nav(props: NavProps) {
  const { showMobileNav, showDesktopNav } = useNavExemptions();

  const { url } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleMenuButtonClicked() {
    setMenuOpen((open) => !open);
  }

  function handleCloseMenuRequested() {
    setMenuOpen(false);
  }

  // Close the menu if the URL changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [url]);

  return (
    <Grid
      class={clsx(
        props.class,
        "fixed desktop:top-0 not-desktop:bottom-0 left-0 right-0 desktop:grid-rows-[auto_auto_1fr] not-desktop:grid-rows-[1fr_auto_auto]",
        {
          "desktop:bottom-0 not-desktop:top-0": menuOpen,
          "pointer-events-none": !menuOpen,
        },
      )}
    >
      <div class="desktop:hidden row-3 pointer-events-auto relative z-2">
        {showMobileNav && (
          <MobileNavBar onMenuButtonClick={handleMenuButtonClicked} />
        )}
      </div>
      <div class="not-desktop:hidden row-1 pointer-events-auto relative z-2">
        {showDesktopNav && (
          <DesktopNavBar onMenuButtonClick={handleMenuButtonClicked} />
        )}
      </div>
      <NavMenu
        class="relative z-1 row-2"
        open={menuOpen}
        onClose={handleCloseMenuRequested}
      />
      <div
        class="relative z-0 h-full desktop:row-3 not-desktop:row-1"
        onClick={handleCloseMenuRequested}
      />
    </Grid>
  );
}
