import clsx from "clsx";
import type { ComponentChildren } from "preact";
import type { LayoutTag } from "@/web/components/core/utils";

type GridProps = {
  class?: string;
  children?: ComponentChildren;
  as?: LayoutTag;
};

export function Grid(props: GridProps) {
  const Tag = props.as ?? "div";

  // The current idea is that people using this component would use `grid-cols-`
  // or whatever to set the columns, rows, etc.
  //
  // Alternative is to provide props instead and set them using `style`. Not
  // sure which is better.
  return <Tag class={clsx("grid", props.class)}>{props.children}</Tag>;
}
