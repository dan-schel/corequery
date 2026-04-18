import clsx from "clsx";
import type { ComponentChildren } from "preact";

const styles = {
  default: "text-accent-text underline",
  subtle: "hover:underline",
};

type LinkTextProps = {
  class?: string;
  children?: ComponentChildren;
  style?: keyof typeof styles;
  onClick?: () => void;
  href?: string;
};

export function LinkText(props: LinkTextProps) {
  const style = styles[props.style ?? "default"];
  const _class = clsx(style, "inline", props.class);

  if (props.onClick != null) {
    return (
      <span class={_class} onClick={props.onClick}>
        {props.children}
      </span>
    );
  } else if (props.href != null) {
    return (
      <a class={_class} href={props.href}>
        {props.children}
      </a>
    );
  } else {
    return <span class={_class}>{props.children}</span>;
  }
}
