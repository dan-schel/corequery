import type { ComponentChildren } from "preact";
import type { Icon } from "@/web/components/icons/type";
import { AccentButtonHousing } from "@/web/components/button/AccentButtonHousing";
import { SimpleButtonLayout } from "@/web/components/button/SimpleButtonLayout";

const themes = {
  accent: AccentButtonHousing,
};
const layouts = {
  simple: SimpleButtonLayout,
};

type ButtonProps = {
  class?: string;
  children?: ComponentChildren;
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
  const Theme = themes[props.theme ?? "accent"];
  const Layout = layouts[props.layout ?? "simple"];

  return (
    <Theme
      class={props.class}
      onClick={props.onClick}
      href={props.href}
      disabled={props.disabled}
      loading={props.loading}
    >
      <Layout icon={props.icon} text={props.text} loading={props.loading} />
    </Theme>
  );
}
