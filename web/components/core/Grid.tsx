import clsx from "clsx";
import type { ComponentChildren } from "preact";
import type { LayoutTag } from "./utils";

type GridProps = {
  as?: LayoutTag;
  children: ComponentChildren;
  class?: string;
};

export function Grid(props: GridProps) {
  const Tag = props.as ?? "div";

  // People using this component would use `grid-cols-` or whatever to set the
  // columns, rows, etc.
  return <Tag class={clsx("grid", props.class)}>{props.children}</Tag>;
}
