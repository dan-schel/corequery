import { MobileNavButton } from "@/web/components/page/nav/MobileNavButton";
import { useNavItems } from "@/web/hooks/use-nav-items";
import clsx from "clsx";
import { useLocation } from "preact-iso";
import { Grid } from "@/web/components/core/Grid";
import { useServiceWorker } from "@/web/hooks/use-service-worker";

type MobileNavBarProps = {
  class?: string;
  onOpenMoreDrawerRequest: () => void;
  onOpenSearchDrawerRequest: () => void;
};

export function MobileNavBar(props: MobileNavBarProps) {
  const { url } = useLocation();
  const navItems = useNavItems();
  const { isUpdateAvailable } = useServiceWorker();

  return (
    <Grid
      class={clsx(
        props.class,
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
          onClick={
            item.opensMoreDrawer
              ? props.onOpenMoreDrawerRequest
              : item.opensSearchDrawer
                ? props.onOpenSearchDrawerRequest
                : undefined
          }
          showBadge={isUpdateAvailable && item.opensMoreDrawer}
        />
      ))}
    </Grid>
  );
}
