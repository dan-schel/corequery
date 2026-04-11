import clsx from "clsx";
import { useLocation } from "preact-iso";
import { Grid } from "@/web/components/core/Grid";
import { MoreDrawer } from "@/web/components/page/nav/MoreDrawer";
import { SearchDrawer } from "@/web/components/page/nav/SearchDrawer";
import { useEffect, useState } from "preact/hooks";
import { useNavExemptions } from "@/web/components/page/use-nav-exemptions";
import { MobileNavBar } from "@/web/components/page/nav/MobileNavBar";
import { DesktopNavBar } from "@/web/components/page/nav/DesktopNavBar";

type NavProps = {
  class?: string;
};

export function Nav(props: NavProps) {
  const { showMobileNav, showDesktopNav } = useNavExemptions();

  const { url } = useLocation();
  const [moreDrawerOpen, setMoreDrawerOpen] = useState(false);
  const [searchDrawerOpen, setSearchDrawerOpen] = useState(false);

  function handleOpenMoreDrawerRequest() {
    setSearchDrawerOpen(false);
    setMoreDrawerOpen((open) => !open);
  }

  function handleOpenSearchDrawerRequest() {
    setMoreDrawerOpen(false);
    setSearchDrawerOpen((open) => !open);
  }

  function handleCloseDrawersRequest() {
    setMoreDrawerOpen(false);
    setSearchDrawerOpen(false);
  }

  // Close both panels if the URL changes.
  useEffect(() => {
    setMoreDrawerOpen(false);
    setSearchDrawerOpen(false);
  }, [url]);

  return (
    <Grid
      class={clsx(
        props.class,
        "fixed top-0 bottom-0 left-0 right-0 desktop:grid-rows-[auto_1fr] not-desktop:grid-rows-[1fr_auto]",
        {
          "pointer-events-none": !moreDrawerOpen && !searchDrawerOpen,
        },
      )}
    >
      <div class="desktop:hidden row-2 pointer-events-auto relative z-1">
        {showMobileNav && (
          <MobileNavBar
            onOpenMoreDrawerRequest={handleOpenMoreDrawerRequest}
            onOpenSearchDrawerRequest={handleOpenSearchDrawerRequest}
          />
        )}
      </div>
      <div class="not-desktop:hidden row-1 pointer-events-auto relative z-1">
        {showDesktopNav && (
          <DesktopNavBar
            onOpenMoreDrawerRequest={handleOpenMoreDrawerRequest}
            onOpenSearchDrawerRequest={handleOpenSearchDrawerRequest}
          />
        )}
      </div>
      <div class="relative z-0 h-full desktop:row-2 not-desktop:row-1">
        <div class="absolute desktop:top-0 not-desktop:bottom-0 left-0 right-0 z-1">
          <MoreDrawer
            open={moreDrawerOpen}
            onClose={handleCloseDrawersRequest}
          />
        </div>
        <div class="absolute top-0 left-0 right-0 z-1">
          <SearchDrawer open={searchDrawerOpen} />
        </div>
        <div
          class="absolute top-0 left-0 right-0 bottom-0 z-0"
          onClick={handleCloseDrawersRequest}
        />
      </div>
    </Grid>
  );
}
