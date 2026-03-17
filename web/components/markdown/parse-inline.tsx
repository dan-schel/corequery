import type { ComponentChildren } from "preact";
import type { InlineStyle } from "@/web/components/markdown/style";

const linkPattern = /\[([^[\]]+)\]\(([^()]+)\)/;
const boldPattern = /\*\*([^*]+)\*\*/;
const italicPattern = /\*([^*]+)\*/;
const underscoreItalicPattern = /_([^_]+)_/;

type InlineMatch = {
  readonly index: number;
  readonly fullMatch: string;
  readonly render: (style: InlineStyle) => ComponentChildren;
};

export function renderInlineTokens(
  text: string,
  style: InlineStyle,
): ComponentChildren[] {
  const output: ComponentChildren[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    const match = findEarliestMatch(remaining);

    if (match == null) {
      output.push(remaining);
      break;
    }

    if (match.index > 0) {
      output.push(remaining.slice(0, match.index));
    }

    output.push(match.render(style));
    remaining = remaining.slice(match.index + match.fullMatch.length);
  }

  return output;
}

function findEarliestMatch(text: string): InlineMatch | null {
  const candidates = [
    matchLink(text),
    matchBold(text),
    matchItalic(text, italicPattern),
    matchItalic(text, underscoreItalicPattern),
  ];

  let best: InlineMatch | null = null;
  for (const candidate of candidates) {
    if (candidate != null && (best == null || candidate.index < best.index)) {
      best = candidate;
    }
  }

  return best;
}

function matchLink(text: string): InlineMatch | null {
  const m = text.match(linkPattern);
  if (m == null || m.index == null || m[1] == null || m[2] == null) return null;

  const linkText = m[1];
  const href = m[2];

  if (!href.startsWith("https://")) return null;

  return {
    index: m.index,
    fullMatch: m[0],
    render: (style) => style.link(linkText, href),
  };
}

function matchBold(text: string): InlineMatch | null {
  const m = text.match(boldPattern);
  if (m == null || m.index == null || m[1] == null) return null;

  const content = m[1];

  return {
    index: m.index,
    fullMatch: m[0],
    render: (style) => style.bold(content),
  };
}

function matchItalic(text: string, pattern: RegExp): InlineMatch | null {
  const m = text.match(pattern);
  if (m == null || m.index == null || m[1] == null) return null;

  const content = m[1];

  return {
    index: m.index,
    fullMatch: m[0],
    render: (style) => style.italic(content),
  };
}
