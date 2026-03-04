import { MobileNavButton } from "@/web/components/page/MobileNavButton";
import { navItems } from "@/web/components/page/nav-items";
import clsx from "clsx";
import { useLocation } from "preact-iso";
import { Grid } from "@/web/components/core/Grid";

type MobileNavProps = {
  class?: string;
};

export function MobileNav(props: MobileNavProps) {
  const { url } = useLocation();

  return (
    <Grid
      class={clsx(
        props.class,
        "fixed bottom-0 left-0 right-0 bg-bg-navbar grid-cols-[repeat(auto-fit,minmax(0,1fr))] border-t border-soft-border",
      )}
    >
      {navItems.map((item) => (
        <MobileNavButton
          class="grow"
          text={item.name}
          regularIcon={"icon" in item ? item.icon : item.regularIcon}
          activeIcon={"icon" in item ? item.icon : item.activeIcon}
          href={"href" in item ? item.href : undefined}
          active={"isActive" in item ? item.isActive(url) : false}
        />
      ))}
    </Grid>
  );
}
