import clsx from "clsx";
import { useLocation } from "preact-iso";
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
    <div class={clsx(props.class, "pointer-events-none")}>
      <div class="fixed bottom-0 top-auto left-0 right-0 desktop:top-0 desktop:bottom-auto z-1">
        <div class="desktop:hidden pointer-events-auto relative z-1">
          {showMobileNav && (
            <MobileNavBar
              onOpenMoreDrawerRequest={handleOpenMoreDrawerRequest}
              onOpenSearchDrawerRequest={handleOpenSearchDrawerRequest}
            />
          )}
        </div>
        <div class="not-desktop:hidden pointer-events-auto relative z-1">
          {showDesktopNav && (
            <DesktopNavBar
              onOpenMoreDrawerRequest={handleOpenMoreDrawerRequest}
              onOpenSearchDrawerRequest={handleOpenSearchDrawerRequest}
            />
          )}
        </div>
        <div
          class={clsx(
            "absolute desktop:top-full not-desktop:bottom-full left-0 right-0 z-0",
            {
              "pointer-events-auto": moreDrawerOpen,
            },
          )}
        >
          <MoreDrawer
            open={moreDrawerOpen}
            onClose={handleCloseDrawersRequest}
          />
        </div>
      </div>
      <div
        class={clsx("fixed top-0 left-0 right-0 z-0", {
          "not-desktop:bottom-18": showMobileNav,
          "not-desktop:bottom-0": !showMobileNav,
          "desktop:top-12 desktop:bottom-0": showDesktopNav,
          "desktop:bottom-0": !showDesktopNav,
        })}
      >
        <div class="absolute inset-0 z-1 pointer-events-none">
          <SearchDrawer
            class={clsx({ "pointer-events-auto": searchDrawerOpen })}
            open={searchDrawerOpen}
            onClose={handleCloseDrawersRequest}
          />
        </div>
        <div
          class={clsx("absolute inset-0 z-0", {
            "pointer-events-auto": moreDrawerOpen || searchDrawerOpen,
          })}
          onClick={handleCloseDrawersRequest}
        />
      </div>
    </div>
  );
}
