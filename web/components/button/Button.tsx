import type { ComponentChildren } from "preact";
import type { Icon } from "@/web/components/icons/type";
import { AccentButtonHousing } from "@/web/components/button/housings/AccentButtonHousing";
import { SimpleButtonLayout } from "@/web/components/button/layouts/SimpleButtonLayout";
import { DefaultButtonHousing } from "@/web/components/button/housings/DefaultButtonHousing";
import { OutlinedButtonHousing } from "@/web/components/button/housings/OutlinedButtonHousing";
import { HoverButtonHousing } from "@/web/components/button/housings/HoverButtonHousing";
import { HoverSquareButtonHousing } from "@/web/components/button/housings/HoverSquareButtonHousing";
import { MenuItemButtonLayout } from "@/web/components/button/layouts/MenuItemButtonLayout";

const themes = {
  "default": DefaultButtonHousing,
  "accent": AccentButtonHousing,
  "outlined": OutlinedButtonHousing,
  "hover": HoverButtonHousing,
  "hover-square": HoverSquareButtonHousing,
};
const layouts = {
  "simple": SimpleButtonLayout,
  "menu-item": MenuItemButtonLayout,
};

type ButtonProps = {
  class?: string;
  onClick?: () => void;
  href?: string;
  onHrefClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: Icon;
  text?: ComponentChildren;
  theme?: keyof typeof themes;
  layout?: keyof typeof layouts;
};

export function Button(props: ButtonProps) {
  const Theme = themes[props.theme ?? "default"];
  const Layout = layouts[props.layout ?? "simple"];

  return (
    <Theme
      class={props.class}
      onClick={props.onClick}
      href={props.href}
      onHrefClick={props.onHrefClick}
      disabled={props.disabled}
      loading={props.loading}
    >
      <Layout icon={props.icon} text={props.text} />
    </Theme>
  );
}
