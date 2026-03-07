import { useNavItems } from "@/web/components/page/nav-items";
import clsx from "clsx";
import { useLocation } from "preact-iso";
import { Grid } from "@/web/components/core/Grid";
import { MobileNavMenu } from "@/web/components/page/MobileNavMenu";
import { useEffect, useState } from "preact/hooks";
import { DesktopNavButton } from "@/web/components/page/DesktopNavButton";
import { Row } from "@/web/components/core/Row";

type DesktopNavProps = {
  class?: string;
};

export function DesktopNav(props: DesktopNavProps) {
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
        "fixed top-0 left-0 right-0 grid-rows-[auto_auto_1fr] hidden desktop:block",
        { "top-0": menuOpen, "pointer-events-none": !menuOpen },
      )}
    >
      <Row
        class={clsx(
          props.class,
          "h-12 bg-bg-navbar border-b border-soft-border relative z-2",
        )}
        yAlign="center"
      >
        {navItems.map((item) => (
          <DesktopNavButton
            class="pointer-events-auto"
            text={item.name}
            regularIcon={"icon" in item ? item.icon : item.regularIcon}
            activeIcon={"icon" in item ? item.icon : item.activeIcon}
            active={"isActive" in item ? item.isActive(url) : false}
            href={"href" in item ? item.href : undefined}
            onClick={"opensMenu" in item ? handleMenuButtonClicked : undefined}
          />
        ))}
      </Row>
      <MobileNavMenu
        class="relative z-1"
        open={menuOpen}
        onClose={handleCloseMenuRequested}
      />
      <div class="relative z-0" onClick={handleCloseMenuRequested} />
    </Grid>
  );
}
