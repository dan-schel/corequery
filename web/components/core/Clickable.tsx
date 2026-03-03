import type { ComponentChildren } from "preact";
import { Grid } from "@/web/components/core/Grid";
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

  if (props.onClick != null) {
    return (
      <button class={_class} onClick={props.onClick} disabled={props.disabled}>
        {props.children}
      </button>
    );
  } else if (props.href != null && !(props.disabled ?? false)) {
    return (
      <a class={_class} href={props.href}>
        {props.children}
      </a>
    );
  } else {
    return <Grid class={props.class}>{props.children}</Grid>;
  }
}
