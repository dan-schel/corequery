import type { ComponentChildren } from "preact";
import clsx from "clsx";
import { TextBoxTrim } from "@/web/components/core/TextBoxTrim";
import {
  generateColoredTextCss,
  type TextColor,
} from "@/web/components/core/ColoredText";

type TextBlockTag =
  "span" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "pre" | "li";

const styles = {
  "regular": "text-md text-fg",
  "weak": "text-md text-fg-weak",
  "strong": "text-md font-bold text-fg-strong",

  "subtitle": "text-lg font-bold text-fg-strong",
  "title": "text-xl font-bold text-fg-strong",
  "megatitle": "text-2xl font-bold text-fg-strong",

  "small": "text-sm text-fg",
  "small-weak": "text-sm text-fg-weak",
  "small-strong-accent": "text-sm text-accent-text font-bold",
  "tiny-narrow": "text-xs text-fg font-stretch-semi-condensed",

  "wordmark": "text-mdlg font-bold text-fg-strong",
  "disclaimer": "text-xs text-fg font-stretch-semi-condensed",
  "skipped-stop": "text-sm text-fg-weak italic",

  "departure-headline": "text-mdlg font-bold text-fg-strong",
  "departure-headline-struckout":
    "text-mdlg text-fg-weak-on-raised line-through",
  "departure-info": "text-sm text-fg font-stretch-semi-condensed",
  "departure-info-struckout":
    "text-sm text-fg-weak-on-raised font-stretch-semi-condensed line-through",
  "departure-info-success":
    "text-sm text-success-text font-bold font-stretch-semi-condensed",
  "departure-info-warning":
    "text-sm text-warning-text font-bold font-stretch-semi-condensed",
  "departure-info-error":
    "text-sm text-error-text font-bold font-stretch-semi-condensed",

  "service-time": "text-mdlg text-fg",
  "service-time-struckout": "text-mdlg text-fg-weak-on-bg line-through",
};

const alignments = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
  justify: "text-justify",
};

export type TextBlockProps = {
  class?: string;
  children?: ComponentChildren;
  as?: TextBlockTag;
  align?: keyof typeof alignments;
  style?: keyof typeof styles;
  oneLine?: boolean;
  dynamicColor?: TextColor | null;
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
    <Tag
      class={clsx(props.class, style, align)}
      style={generateColoredTextCss(props.dynamicColor)}
    >
      <TextBoxTrim>{content}</TextBoxTrim>
    </Tag>
  );
}
