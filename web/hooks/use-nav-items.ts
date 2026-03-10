import { MingcuteAlertDiamondFill } from "@/web/components/icons/MingcuteAlertDiamondFill";
import { MingcuteAlertDiamondLine } from "@/web/components/icons/MingcuteAlertDiamondLine";
import { MingcuteHome4Fill } from "@/web/components/icons/MingcuteHome4Fill";
import { MingcuteHome4Line } from "@/web/components/icons/MingcuteHome4Line";
import { MingcuteMapPinFill } from "@/web/components/icons/MingcuteMapPinFill";
import { MingcuteMapPinLine } from "@/web/components/icons/MingcuteMapPinLine";
import { MingcuteMenuLine } from "@/web/components/icons/MingcuteMenuLine";
import type { Icon } from "@/web/components/icons/type";
import { MingcuteChartVerticalLine } from "@/web/components/icons/MingcuteChartVerticalLine";
import { MingcuteSettings7Line } from "@/web/components/icons/MingcuteSettings7Line";
import { UilInfoCircle } from "@/web/components/icons/UilInfoCircle";
import { MingcuteToolLine } from "@/web/components/icons/MingcuteToolLine";
import { MingcuteTv1Line } from "@/web/components/icons/MingcuteTv1Line";
import { useStaticData } from "@/web/hooks/use-static-data";

type NavItem = RegularNavItem | MenuNavItem;

type RegularNavItem = {
  readonly name: string;
  readonly href: string;
  readonly regularIcon: Icon;
  readonly activeIcon: Icon;
  readonly isActive: (url: string) => boolean;
};

type MenuNavItem = {
  readonly name: string;
  readonly icon: Icon;
  readonly opensMenu: true;
};

type MenuItem = {
  readonly name: string;
  readonly href: string;
  readonly icon: Icon;
};

export function useNavItems(): NavItem[] {
  return [
    {
      name: "Home",
      href: "/",
      regularIcon: MingcuteHome4Line,
      activeIcon: MingcuteHome4Fill,
      isActive: (url) => url === "/",
    },
    {
      name: "Status",
      href: "/status",
      regularIcon: MingcuteAlertDiamondLine,
      activeIcon: MingcuteAlertDiamondFill,
      isActive: (url) => url === "/status",
    },
    {
      name: "Nearby",
      href: "/nearby",
      regularIcon: MingcuteMapPinLine,
      activeIcon: MingcuteMapPinFill,
      isActive: (url) => url === "/nearby",
    },
    {
      name: "More",
      icon: MingcuteMenuLine,
      opensMenu: true,
    },
  ];
}

export function useMenuItems(): MenuItem[] {
  const { appName } = useStaticData();

  return [
    { name: `About ${appName}`, href: "/about", icon: UilInfoCircle },
    { name: "Settings", href: "/settings", icon: MingcuteSettings7Line },
    { name: "Developer info", href: "/debug", icon: MingcuteChartVerticalLine },
    { name: "Admin controls", href: "/admin", icon: MingcuteToolLine },
    { name: "Zen mode", href: "/zen", icon: MingcuteTv1Line },
  ];
}
