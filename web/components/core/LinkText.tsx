import clsx from "clsx";
import type { ComponentChildren } from "preact";

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
  colorOverride?: {
    lightModeHexCode: string;
    darkModeHexCode: string;
  } | null;
};

export function LinkText(props: LinkTextProps) {
  const style = styles[props.style ?? "default"];
  const _class = clsx(style, "inline", props.class);

  // Tailwind classes can't be generated dynamically anyway, so may as well use
  // inline CSS if a color override is set.
  const css =
    props.colorOverride != null
      ? {
          color: `light-dark(${props.colorOverride.lightModeHexCode}, ${props.colorOverride.darkModeHexCode})`,
        }
      : undefined;

  if (props.onClick != null) {
    return (
      <span class={_class} style={css} onClick={props.onClick}>
        {props.children}
      </span>
    );
  } else if (props.href != null) {
    return (
      <a class={_class} style={css} href={props.href}>
        {props.children}
      </a>
    );
  } else {
    return (
      <span class={_class} style={css}>
        {props.children}
      </span>
    );
  }
}
