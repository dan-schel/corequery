import { MobileNavButton } from "@/web/components/page/MobileNavButton";
import { useNavItems } from "@/web/components/page/nav-items";
import clsx from "clsx";
import { useLocation } from "preact-iso";
import { Grid } from "@/web/components/core/Grid";
import { NavMenu } from "@/web/components/page/NavMenu";
import { useEffect, useState } from "preact/hooks";

type MobileNavProps = {
  class?: string;
};

export function MobileNav(props: MobileNavProps) {
  const { url } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = useNavItems();

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
        "fixed bottom-0 left-0 right-0 grid-rows-[1fr_auto_auto] desktop:hidden",
        { "top-0": menuOpen, "pointer-events-none": !menuOpen },
      )}
    >
      <div class="relative z-0" onClick={handleCloseMenuRequested} />
      <NavMenu
        class="relative z-1"
        open={menuOpen}
        onClose={handleCloseMenuRequested}
      />
      <Grid class="h-18 bg-bg-navbar grid-cols-[repeat(auto-fit,minmax(0,1fr))] border-t border-soft-border px-2 relative z-2">
        {navItems.map((item) => (
          <MobileNavButton
            class="pointer-events-auto"
            text={item.name}
            regularIcon={"icon" in item ? item.icon : item.regularIcon}
            activeIcon={"icon" in item ? item.icon : item.activeIcon}
            active={"isActive" in item ? item.isActive(url) : false}
            href={"href" in item ? item.href : undefined}
            onClick={"opensMenu" in item ? handleMenuButtonClicked : undefined}
          />
        ))}
      </Grid>
    </Grid>
  );
}
