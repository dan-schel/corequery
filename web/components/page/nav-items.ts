import { MingcuteAlertDiamondFill } from "@/web/components/icons/MingcuteAlertDiamondFill";
import { MingcuteAlertDiamondLine } from "@/web/components/icons/MingcuteAlertDiamondLine";
import { MingcuteHome4Fill } from "@/web/components/icons/MingcuteHome4Fill";
import { MingcuteHome4Line } from "@/web/components/icons/MingcuteHome4Line";
import { MingcuteMapPinFill } from "@/web/components/icons/MingcuteMapPinFill";
import { MingcuteMapPinLine } from "@/web/components/icons/MingcuteMapPinLine";
import { MingcuteMenuLine } from "@/web/components/icons/MingcuteMenuLine";
import type { Icon } from "@/web/components/icons/type";

export type NavItem = RegularNavItem | MenuNavItem;

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

export type MenuItem = {
  readonly name: string;
  readonly href: string;
  readonly icon: Icon;
};

export const navItems: readonly NavItem[] = [
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

export const menuItems: readonly MenuItem[] = [
  { name: "About", href: "/about", icon: MingcuteAlertDiamondLine },
  { name: "Settings", href: "/settings", icon: MingcuteAlertDiamondLine },
  { name: "Developer info", href: "/debug", icon: MingcuteAlertDiamondLine },
  { name: "Admin controls", href: "/admin", icon: MingcuteAlertDiamondLine },
  { name: "Zen mode", href: "/zen", icon: MingcuteAlertDiamondLine },
];
