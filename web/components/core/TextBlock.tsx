import type { ComponentChildren } from "preact";
import clsx from "clsx";

type TextBlockTag = "span" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

const styles = {
  regular: "text-md text-fg",
  strong: "text-md font-bold text-fg-strong",
  subtitle: "text-lg font-bold text-fg-strong",
  title: "text-xl font-bold text-fg-strong",
};

const alignments = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
  justify: "text-justify",
};

type TextBlockProps = {
  class?: string;
  children?: ComponentChildren;
  as?: TextBlockTag;
  align?: keyof typeof alignments;
  style?: keyof typeof styles;
};

export function TextBlock(props: TextBlockProps) {
  const Tag = props.as ?? "span";
  const align = alignments[props.align ?? "left"];
  const style = styles[props.style ?? "regular"];

  return <Tag class={clsx(props.class, style, align)}>{props.children}</Tag>;
}
