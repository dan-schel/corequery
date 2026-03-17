import type { ComponentChildren } from "preact";
import { Italic } from "@/web/components/core/Italic";
import { LinkText } from "@/web/components/core/LinkText";
import { Strong } from "@/web/components/core/Strong";
import { TextBlock } from "@/web/components/core/TextBlock";

type InlineRenderer = (text: ComponentChildren) => ComponentChildren;

type LinkRenderer = (
  text: ComponentChildren,
  href: string,
) => ComponentChildren;

export type InlineStyle = {
  readonly bold: InlineRenderer;
  readonly italic: InlineRenderer;
  readonly link: LinkRenderer;
};

type BlockRenderer = (
  text: ComponentChildren,
  key: string | number,
) => ComponentChildren;

type BlockStyle = {
  readonly render: BlockRenderer;
  readonly marginTop: string;
};

export type MarkdownStyle = {
  readonly h1: BlockStyle;
  readonly h2: BlockStyle;
  readonly h3: BlockStyle;
  readonly p: BlockStyle;
  readonly bold: InlineRenderer;
  readonly italic: InlineRenderer;
  readonly link: LinkRenderer;
};

export const defaultInlineStyle: InlineStyle = {
  bold: (text) => <Strong>{text}</Strong>,
  italic: (text) => <Italic>{text}</Italic>,
  link: (text, href) => <LinkText href={href}>{text}</LinkText>,
};

export const defaultStyle: MarkdownStyle = {
  h1: {
    render: (text, key) => (
      <TextBlock key={key} as="h1" style="title">
        {text}
      </TextBlock>
    ),
    marginTop: "mt-12",
  },
  h2: {
    render: (text, key) => (
      <TextBlock key={key} as="h2" style="subtitle">
        {text}
      </TextBlock>
    ),
    marginTop: "mt-12",
  },
  h3: {
    render: (text, key) => (
      <TextBlock key={key} as="h3" style="strong">
        {text}
      </TextBlock>
    ),
    marginTop: "mt-12",
  },
  p: {
    render: (text, key) => (
      <TextBlock key={key} as="p">
        {text}
      </TextBlock>
    ),
    marginTop: "mt-8",
  },
  bold: defaultInlineStyle.bold,
  italic: defaultInlineStyle.italic,
  link: defaultInlineStyle.link,
};
