import { useNavItems } from "@/web/components/page/nav-items";
import { useLocation } from "preact-iso";
import { DesktopNavButton } from "@/web/components/page/DesktopNavButton";
import { Row } from "@/web/components/core/Row";
import { PageCenterer } from "@/web/components/page/PageCenterer";
import clsx from "clsx";

type DesktopNavBarProps = {
  class?: string;
  onMenuButtonClick: () => void;
};

export function DesktopNavBar(props: DesktopNavBarProps) {
  const { url } = useLocation();
  const navItems = useNavItems();

  return (
    <PageCenterer
      class={clsx(props.class, "h-12 bg-bg-navbar border-b border-soft-border")}
    >
      <Row yAlign="center">
        {navItems.map((item) => (
          <DesktopNavButton
            text={item.name}
            regularIcon={"icon" in item ? item.icon : item.regularIcon}
            activeIcon={"icon" in item ? item.icon : item.activeIcon}
            active={"isActive" in item ? item.isActive(url) : false}
            href={"href" in item ? item.href : undefined}
            onClick={"opensMenu" in item ? props.onMenuButtonClick : undefined}
          />
        ))}
      </Row>
    </PageCenterer>
  );
}
