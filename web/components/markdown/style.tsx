import type { ComponentChildren } from "preact";
import { TextBlock } from "@/web/components/core/TextBlock";

export type MarkdownStyle = {
  readonly h1: BlockRenderer;
  readonly h2: BlockRenderer;
  readonly h3: BlockRenderer;
  readonly p: BlockRenderer;
};

type BlockRenderer = (
  text: ComponentChildren,
  index: number,
) => ComponentChildren;

export const defaultStyle: MarkdownStyle = {
  h1: (text, i) => (
    <TextBlock key={i} as="h1" style="title">
      {text}
    </TextBlock>
  ),
  h2: (text, i) => (
    <TextBlock key={i} as="h2" style="subtitle">
      {text}
    </TextBlock>
  ),
  h3: (text, i) => (
    <TextBlock key={i} as="h3" style="strong">
      {text}
    </TextBlock>
  ),
  p: (text, i) => (
    <TextBlock key={i} as="p">
      {text}
    </TextBlock>
  ),
};
