import type { ComponentChildren } from "preact";
import clsx from "clsx";

type TextBlockTag = "span" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

const styles = {
  regular: "text-md",
  strong: "text-md font-bold",
  subtitle: "text-lg font-bold",
  title: "text-xl font-bold",
};

const alignments = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
  justify: "text-justify",
};

type TextBlockProps = {
  children: ComponentChildren;
  as?: TextBlockTag;
  align?: keyof typeof alignments;
  style?: keyof typeof styles;
  class?: string;
};

export function TextBlock(props: TextBlockProps) {
  const Tag = props.as ?? "span";
  const align = alignments[props.align ?? "left"];
  const style = styles[props.style ?? "regular"];

  return <Tag class={clsx(props.class, style, align)}>{props.children}</Tag>;
}
