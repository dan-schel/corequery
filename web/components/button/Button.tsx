import type { ComponentChildren } from "preact";
import type { Icon } from "@/web/components/icons/type";
import { AccentButtonHousing } from "@/web/components/button/AccentButtonHousing";
import { SimpleButtonLayout } from "@/web/components/button/SimpleButtonLayout";
import { DefaultButtonHousing } from "@/web/components/button/DefaultButtonHousing";
import { OutlinedButtonHousing } from "@/web/components/button/OutlinedButtonHousing";
import { HoverButtonHousing } from "@/web/components/button/HoverButtonHousing";

const themes = {
  default: DefaultButtonHousing,
  accent: AccentButtonHousing,
  outlined: OutlinedButtonHousing,
  hover: HoverButtonHousing,
};
const layouts = {
  simple: SimpleButtonLayout,
};

type ButtonProps = {
  class?: string;
  onClick?: () => void;
  href?: string;
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
      disabled={props.disabled}
      loading={props.loading}
    >
      <Layout icon={props.icon} text={props.text} />
    </Theme>
  );
}
