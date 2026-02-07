import clsx from "clsx";
import type { ComponentChildren } from "preact";
import type { LayoutTag } from "@/web/components/core/utils";

const xAlignments = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
  "space-between": "justify-between",
};

const yAlignments = {
  top: "items-start",
  center: "items-center",
  bottom: "items-end",
  stretch: "items-stretch",
};

type RowProps = {
  class?: string;
  children?: ComponentChildren;
  as?: LayoutTag;
  xAlign?: "left" | "center" | "right" | "space-between";
  yAlign?: "stretch" | "top" | "center" | "bottom";
  wrap?: boolean;
};

export function Row(props: RowProps) {
  const Tag = props.as ?? "div";
  const xAlign = xAlignments[props.xAlign ?? "left"];
  const yAlign = yAlignments[props.yAlign ?? "stretch"];

  return (
    <Tag
      class={clsx(
        "flex flex-row",
        xAlign,
        yAlign,
        { "flex-wrap": props.wrap },
        props.class,
      )}
    >
      {props.children}
    </Tag>
  );
}
