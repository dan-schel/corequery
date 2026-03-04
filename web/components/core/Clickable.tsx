import type { ComponentChildren } from "preact";
import clsx from "clsx";

type ButtonProps = {
  class?: string;
  children?: ComponentChildren;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
};

export function Clickable(props: ButtonProps) {
  const _class = clsx(
    "grid not-disabled:cursor-pointer select-none",
    props.class,
  );

  if (
    props.onClick == null &&
    props.href != null &&
    !(props.disabled ?? false)
  ) {
    return (
      <a class={_class} href={props.href}>
        {props.children}
      </a>
    );
  } else {
    return (
      <button class={_class} onClick={props.onClick} disabled={props.disabled}>
        {props.children}
      </button>
    );
  }
}
