import { MingcuteAlertDiamondFill } from "@/web/components/icons/MingcuteAlertDiamondFill";
import { MingcuteAlertDiamondLine } from "@/web/components/icons/MingcuteAlertDiamondLine";
import { MingcuteHome4Fill } from "@/web/components/icons/MingcuteHome4Fill";
import { MingcuteHome4Line } from "@/web/components/icons/MingcuteHome4Line";
import { MingcuteMapPinFill } from "@/web/components/icons/MingcuteMapPinFill";
import { MingcuteMapPinLine } from "@/web/components/icons/MingcuteMapPinLine";
import { MingcuteMenuLine } from "@/web/components/icons/MingcuteMenuLine";
import type { Icon } from "@/web/components/icons/type";
import { MingcuteToolLine } from "@/web/components/icons/MingcuteToolLine";
import { MingcuteToolFill } from "@/web/components/icons/MingcuteToolFill";

type NavItem = RegularNavItem | MenuNavItem;

type RegularNavItem = {
  name: string;
  href: string;
  regularIcon: Icon;
  activeIcon: Icon;
  isActive: (url: string) => boolean;
};

type MenuNavItem = {
  name: string;
  icon: Icon;
  subitems: { name: string; href: string }[];
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
    name: "Nearby",
    href: "/nearby",
    regularIcon: MingcuteMapPinLine,
    activeIcon: MingcuteMapPinFill,
    isActive: (url) => url === "/nearby",
  },
  {
    name: "Status",
    href: "/status",
    regularIcon: MingcuteAlertDiamondLine,
    activeIcon: MingcuteAlertDiamondFill,
    isActive: (url) => url === "/status",
  },
  {
    name: "Admin",
    href: "/admin",
    regularIcon: MingcuteToolLine,
    activeIcon: MingcuteToolFill,
    isActive: (url) => url === "/admin",
  },
  {
    name: "More",
    icon: MingcuteMenuLine,
    subitems: [
      { name: "About", href: "/about" },
      { name: "Settings", href: "/settings" },
      { name: "Developer Info", href: "/debug" },
      { name: "Admin Controls", href: "/admin" },
      { name: "Zen Mode", href: "/zen" },
    ],
  },
];
