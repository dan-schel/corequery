import { MobileNavButton } from "@/web/components/page/MobileNavButton";
import { useNavItems, type NavItem } from "@/web/components/page/nav-items";
import clsx from "clsx";
import { useLocation } from "preact-iso";
import { Grid } from "@/web/components/core/Grid";
import { MobileNavMenu } from "@/web/components/page/MobileNavMenu";
import { useState } from "preact/hooks";

type MobileNavProps = {
  class?: string;
};

export function MobileNav(props: MobileNavProps) {
  const { url, route } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = useNavItems();

  function handleNavButtonClicked(item: NavItem) {
    if ("opensMenu" in item) {
      setMenuOpen((open) => !open);
    } else {
      setMenuOpen(false);
      route(item.href);
    }
  }

  function handleMenuCloseRequested() {
    setMenuOpen(false);
  }

  return (
    <Grid
      class={clsx(
        props.class,
        "fixed bottom-0 left-0 right-0 grid-rows-[1fr_auto_auto]",
        { "top-0": menuOpen },
      )}
    >
      <div class="relative z-0" onClick={handleMenuCloseRequested} />
      <MobileNavMenu
        class="relative z-1"
        open={menuOpen}
        onClose={handleMenuCloseRequested}
      />
      <Grid
        class={clsx(
          props.class,
          "bg-bg-navbar grid-cols-[repeat(auto-fit,minmax(0,1fr))] border-t border-soft-border px-2 relative z-2",
        )}
      >
        {navItems.map((item) => (
          <MobileNavButton
            class="grow"
            text={item.name}
            regularIcon={"icon" in item ? item.icon : item.regularIcon}
            activeIcon={"icon" in item ? item.icon : item.activeIcon}
            active={"isActive" in item ? item.isActive(url) : false}
            onClick={() => handleNavButtonClicked(item)}
          />
        ))}
      </Grid>
    </Grid>
  );
}
