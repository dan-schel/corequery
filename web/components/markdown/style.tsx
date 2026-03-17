import type { ComponentChildren } from "preact";
import { TextBlock } from "@/web/components/core/TextBlock";

export type BlockStyle = {
  readonly render: BlockRenderer;
  readonly marginTop: string;
};

type BlockRenderer = (
  text: ComponentChildren,
  key: string | number,
) => ComponentChildren;

export type MarkdownStyle = {
  readonly h1: BlockStyle;
  readonly h2: BlockStyle;
  readonly h3: BlockStyle;
  readonly p: BlockStyle;
};

export const defaultStyle: MarkdownStyle = {
  h1: {
    render: (text, key) => (
      <TextBlock key={key} as="h1" style="title">
        {text}
      </TextBlock>
    ),
    marginTop: "mt-8",
  },
  h2: {
    render: (text, key) => (
      <TextBlock key={key} as="h2" style="subtitle">
        {text}
      </TextBlock>
    ),
    marginTop: "mt-8",
  },
  h3: {
    render: (text, key) => (
      <TextBlock key={key} as="h3" style="strong">
        {text}
      </TextBlock>
    ),
    marginTop: "mt-8",
  },
  p: {
    render: (text, key) => (
      <TextBlock key={key} as="p">
        {text}
      </TextBlock>
    ),
    marginTop: "mt-4",
  },
};
