import type { ComponentChildren } from "preact";
import clsx from "clsx";
import { TextBoxTrim } from "@/web/components/core/TextBoxTrim";

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
  oneLine?: boolean;
};

export function TextBlock(props: TextBlockProps) {
  const Tag = props.as ?? "span";
  const align = alignments[props.align ?? "left"];
  const style = styles[props.style ?? "regular"];
  const oneLine = props.oneLine ?? false;

  const content = oneLine ? (
    <span class="whitespace-nowrap overflow-hidden block text-ellipsis">
      {props.children}
    </span>
  ) : (
    props.children
  );

  return (
    <Tag class={clsx(props.class, style, align)}>
      <TextBoxTrim>{content}</TextBoxTrim>
    </Tag>
  );
}
