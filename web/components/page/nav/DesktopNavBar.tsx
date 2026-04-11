import { useNavItems } from "@/web/hooks/use-nav-items";
import { useLocation } from "preact-iso";
import { DesktopNavButton } from "@/web/components/page/nav/DesktopNavButton";
import { Row } from "@/web/components/core/Row";
import { PageCenterer } from "@/web/components/page/PageCenterer";
import clsx from "clsx";
import { HoverSquareButtonHousing } from "@/web/components/button/housings/HoverSquareButtonHousing";
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
      <Row>
        <HoverSquareButtonHousing href="/">
          <Row class="px-4 gap-2" xAlign="center" yAlign="center">
            <Favicon class="text-mdlg" />
            <TextBlock style="wordmark">{appName}</TextBlock>
          </Row>
        </HoverSquareButtonHousing>
        {navItems.map((item) => (
          <DesktopNavButton
            text={item.name}
            regularIcon={"icon" in item ? item.icon : item.regularIcon}
            activeIcon={"icon" in item ? item.icon : item.activeIcon}
            active={"isActive" in item ? item.isActive(url) : false}
            href={"href" in item ? item.href : undefined}
            onClick={
              "opensMoreDrawer" in item
                ? props.onOpenMoreDrawerRequest
                : "opensSearchDrawer" in item
                  ? props.onOpenSearchDrawerRequest
                  : undefined
            }
            showBadge={isUpdateAvailable && "opensMenu" in item}
          />
        ))}
      </Row>
    </PageCenterer>
  );
}
