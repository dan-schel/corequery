import { useNavItems } from "@/web/hooks/use-nav-items";
import { useLocation } from "preact-iso";
import { DesktopNavButton } from "@/web/components/page/nav/DesktopNavButton";
import { Row } from "@/web/components/core/Row";
import { PageCenterer } from "@/web/components/page/PageCenterer";
import clsx from "clsx";
import { HoverButtonHousing } from "@/web/components/button/housings/HoverButtonHousing";
import { Favicon } from "@/web/components/icons/Favicon";
import { TextBlock } from "@/web/components/core/TextBlock";
import { useStaticData } from "@/web/hooks/use-static-data";
import { useServiceWorker } from "@/web/hooks/use-service-worker";

type DesktopNavBarProps = {
  class?: string;
  onOpenMoreDrawerRequest: () => void;
  onOpenSearchDrawerRequest: () => void;
};

export function DesktopNavBar(props: DesktopNavBarProps) {
  const { appName } = useStaticData();
  const { url } = useLocation();
  const navItems = useNavItems();
  const { isUpdateAvailable } = useServiceWorker();

  return (
    <PageCenterer
      class={clsx(props.class, "h-12 bg-bg-navbar border-b border-soft-border")}
    >
      <Row class="gap-2">
        <HoverButtonHousing class="self-center" href="/">
          <Row class="px-4 gap-2 h-8" xAlign="center" yAlign="center">
            <Favicon class="text-icon-md" />
            <TextBlock style="wordmark">{appName}</TextBlock>
          </Row>
        </HoverButtonHousing>
        <Row>
          {navItems.map((item) => (
            <DesktopNavButton
              key={item.name}
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
        </Row>
      </Row>
    </PageCenterer>
  );
}
