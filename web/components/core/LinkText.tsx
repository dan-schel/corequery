import clsx from "clsx";
import type { ComponentChildren } from "preact";

type LinkTextProps = {
  class?: string;
  children?: ComponentChildren;
  onClick?: () => void;
  href?: string;
};

export function LinkText(props: LinkTextProps) {
  const _class = clsx("text-accent inline underline", props.class);

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
