import clsx from "clsx";
import type { ComponentChildren } from "preact";
import {
  generateColoredTextCss,
  type TextColor,
} from "@/web/components/core/ColoredText";

const styles = {
  "default": "text-accent-text underline",
  "subtle": "hover:underline",
  "strong-subtle": "font-bold text-fg-strong hover:underline",
};

type LinkTextProps = {
  class?: string;
  children?: ComponentChildren;
  style?: keyof typeof styles;
  onClick?: () => void;
  href?: string;
  dynamicColor?: TextColor | null;
};

export function LinkText(props: LinkTextProps) {
  const style = styles[props.style ?? "default"];
  const _class = clsx(style, "inline", props.class);

  if (props.onClick != null) {
    return (
      <span
        class={_class}
        style={generateColoredTextCss(props.dynamicColor)}
        onClick={props.onClick}
      >
        {props.children}
      </span>
    );
  } else if (props.href != null) {
    return (
      <a
        class={_class}
        style={generateColoredTextCss(props.dynamicColor)}
        href={props.href}
      >
        {props.children}
      </a>
    );
  } else {
    return (
      <span class={_class} style={generateColoredTextCss(props.dynamicColor)}>
        {props.children}
      </span>
    );
  }
}
