import clsx from "clsx";
import type { ComponentChildren } from "preact";
import type { LayoutTag } from "@/web/components/core/utils";

const xAlignments = {
  left: "items-start",
  center: "items-center",
  right: "items-end",
  stretch: "items-stretch",
};

const yAlignments = {
  top: "justify-start",
  center: "justify-center",
  bottom: "justify-end",
  "space-between": "justify-between",
};

type ColumnProps = {
  class?: string;
  children?: ComponentChildren;
  as?: LayoutTag;
  xAlign?: "stretch" | "left" | "center" | "right";
  yAlign?: "top" | "center" | "bottom" | "space-between";
  wrap?: boolean;
};

export function Column(props: ColumnProps) {
  const Tag = props.as ?? "div";
  const xAlign = xAlignments[props.xAlign ?? "stretch"];
  const yAlign = yAlignments[props.yAlign ?? "top"];

  return (
    <Tag
      class={clsx(
        "flex flex-col",
        yAlign,
        xAlign,
        { "flex-wrap": props.wrap },
        props.class,
      )}
    >
      {props.children}
    </Tag>
  );
}
