import { MobileNavButton } from "@/web/components/page/MobileNavButton";
import { useNavItems } from "@/web/utils/use-nav-items";
import clsx from "clsx";
import { useLocation } from "preact-iso";
import { Grid } from "@/web/components/core/Grid";

type MobileNavBarProps = {
  class?: string;
  onMenuButtonClick: () => void;
};

export function MobileNavBar(props: MobileNavBarProps) {
  const { url } = useLocation();
  const navItems = useNavItems();

  return (
    <Grid
      class={clsx(
        props,
        "h-18 bg-bg-navbar grid-cols-[repeat(auto-fit,minmax(0,1fr))] border-t border-soft-border px-2",
      )}
    >
      {navItems.map((item) => (
        <MobileNavButton
          text={item.name}
          regularIcon={"icon" in item ? item.icon : item.regularIcon}
          activeIcon={"icon" in item ? item.icon : item.activeIcon}
          active={"isActive" in item ? item.isActive(url) : false}
          href={"href" in item ? item.href : undefined}
          onClick={"opensMenu" in item ? props.onMenuButtonClick : undefined}
        />
      ))}
    </Grid>
  );
}
