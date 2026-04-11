import clsx from "clsx";
import { useLocation } from "preact-iso";
import { Grid } from "@/web/components/core/Grid";
import { NavMenu } from "@/web/components/page/NavMenu";
import { SearchPanel } from "@/web/components/page/SearchPanel";
import { useEffect, useState } from "preact/hooks";
import { useNavExemptions } from "@/web/components/page/use-nav-exemptions";
import { MobileNavBar } from "@/web/components/page/MobileNavBar";
import { DesktopNavBar } from "@/web/components/page/DesktopNavBar";
import { useMobileHeader } from "@/web/components/page/use-mobile-header";

type NavProps = {
  class?: string;
};

export function Nav(props: NavProps) {
  const { showMobileNav, showDesktopNav } = useNavExemptions();
  const mobileHeader = useMobileHeader();

  const { url } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  function handleMenuButtonClicked() {
    setSearchOpen(false);
    setMenuOpen((open) => !open);
  }

  function handleSearchButtonClicked() {
    setMenuOpen(false);
    setSearchOpen((open) => !open);
  }

  function handleClosePanelRequested() {
    setMenuOpen(false);
    setSearchOpen(false);
  }

  // Close both panels if the URL changes.
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [url]);

  return (
    <Grid
      class={clsx(
        props.class,
        "fixed desktop:top-0 bottom-0 left-0 right-0 desktop:grid-rows-[auto_1fr] not-desktop:grid-rows-[1fr_auto]",
        {
          "not-desktop:top-0": mobileHeader == null,
          "not-desktop:top-12": mobileHeader != null,
          "pointer-events-none": !menuOpen && !searchOpen,
        },
      )}
    >
      <div class="desktop:hidden row-2 pointer-events-auto relative z-1">
        {showMobileNav && (
          <MobileNavBar
            onMenuButtonClick={handleMenuButtonClicked}
            onSearchButtonClick={handleSearchButtonClicked}
          />
        )}
      </div>
      <div class="not-desktop:hidden row-1 pointer-events-auto relative z-1">
        {showDesktopNav && (
          <DesktopNavBar
            onMenuButtonClick={handleMenuButtonClicked}
            onSearchButtonClick={handleSearchButtonClicked}
          />
        )}
      </div>
      <div class="relative z-0 h-full desktop:row-2 not-desktop:row-1">
        <div class="absolute desktop:top-0 not-desktop:bottom-0 left-0 right-0 z-1">
          <NavMenu open={menuOpen} onClose={handleClosePanelRequested} />
        </div>
        <div class="absolute top-0 left-0 right-0 z-1">
          <SearchPanel open={searchOpen} />
        </div>
        <div
          class="absolute top-0 left-0 right-0 bottom-0 z-0"
          onClick={handleClosePanelRequested}
        />
      </div>
    </Grid>
  );
}
