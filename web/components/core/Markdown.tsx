import clsx from "clsx";
import type { ComponentChildren, ComponentProps } from "preact";
import { Column } from "@/web/components/core/Column";
import { LinkText } from "@/web/components/core/LinkText";
import { TextBlock } from "@/web/components/core/TextBlock";

type TextBlockProps = Omit<ComponentProps<typeof TextBlock>, "children">;

type MarkdownLine = {
  readonly kind: "h1" | "h2" | "h3" | "p";
  readonly content: string;
};

type MarkdownProps = {
  class?: string;
  markdown: string;
  mode?: "inline" | "block";

  inlineProps?: TextBlockProps;
  paragraphProps?: TextBlockProps;
  h1Props?: TextBlockProps;
  h2Props?: TextBlockProps;
  h3Props?: TextBlockProps;
};

const defaultInlineProps: TextBlockProps = { as: "span" };
const defaultParagraphProps: TextBlockProps = { as: "p" };
const defaultH1Props: TextBlockProps = { as: "h1", style: "title" };
const defaultH2Props: TextBlockProps = { as: "h2", style: "subtitle" };
const defaultH3Props: TextBlockProps = { as: "h3", style: "strong" };

export function Markdown(props: MarkdownProps) {
  const mode = props.mode ?? "block";

  if (mode === "inline") {
    return (
      <TextBlock
        {...defaultInlineProps}
        {...props.inlineProps}
        class={props.class}
      >
        {parseInlineMarkdown(props.markdown)}
      </TextBlock>
    );
  }

  const lines = parseMarkdown(props.markdown);

  return (
    <Column class={clsx("gap-6", props.class)}>
      {lines.map((line, index) => {
        const key = `${line.kind}-${index}`;

        if (line.kind === "h1") {
          return (
            <TextBlock key={key} {...defaultH1Props} {...props.h1Props}>
              {parseInlineMarkdown(line.content)}
            </TextBlock>
          );
        }

        if (line.kind === "h2") {
          return (
            <TextBlock key={key} {...defaultH2Props} {...props.h2Props}>
              {parseInlineMarkdown(line.content)}
            </TextBlock>
          );
        }

        if (line.kind === "h3") {
          return (
            <TextBlock key={key} {...defaultH3Props} {...props.h3Props}>
              {parseInlineMarkdown(line.content)}
            </TextBlock>
          );
        }

        return (
          <TextBlock
            key={key}
            {...defaultParagraphProps}
            {...props.paragraphProps}
          >
            {parseInlineMarkdown(line.content)}
          </TextBlock>
        );
      })}
    </Column>
  );
}

function parseMarkdown(markdown: string): readonly MarkdownLine[] {
  const lines = markdown
    .split("\n")
    .map((line) => line.replace(/[\r\t]/g, "").trim())
    .filter((line) => line.length !== 0);

  return lines.map((line) => {
    if (/^# (.+)$/g.test(line)) {
      return { kind: "h1", content: line.replace(/^# /, "") };
    }

    if (/^## (.+)$/g.test(line)) {
      return { kind: "h2", content: line.replace(/^## /, "") };
    }

    if (/^### (.+)$/g.test(line)) {
      return { kind: "h3", content: line.replace(/^### /, "") };
    }

    return { kind: "p", content: line };
  });
}

function parseInlineMarkdown(line: string): ComponentChildren[] {
  const output: ComponentChildren[] = [];
  const tokenRegex =
    /\[([^[\]]+)\]\(([^()]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|_([^_]+)_/g;

  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(line)) !== null) {
    if (match.index > cursor) {
      output.push(line.slice(cursor, match.index));
    }

    if (match[1] != null && match[2] != null) {
      output.push(
        <LinkText href={sanitizeHref(match[2])}>{match[1]}</LinkText>,
      );
    } else if (match[3] != null) {
      output.push(<b>{match[3]}</b>);
    } else if (match[4] != null) {
      output.push(<i>{match[4]}</i>);
    } else if (match[5] != null) {
      output.push(<i>{match[5]}</i>);
    }

    cursor = match.index + match[0].length;
  }

  if (cursor < line.length) {
    output.push(line.slice(cursor));
  }

  return output;
}

function sanitizeHref(href: string) {
  if (/^\s*(javascript:|data:)/i.test(href)) {
    return "#";
  }

  return href;
}
