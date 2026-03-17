import type { ComponentChildren } from "preact";
import { LinkText } from "@/web/components/core/LinkText";

// Each pattern is tried in order. The first capture group of each is the
// content to render (except for links which use groups 1 and 2).
const inlinePatterns = [
  { regex: /\[([^[\]]+)\]\(([^()]+)\)/, type: "link" },
  { regex: /\*\*([^*]+)\*\*/, type: "bold" },
  { regex: /\*([^*]+)\*/, type: "italic" },
  { regex: /_([^_]+)_/, type: "italic" },
] as const;

export function renderInlineTokens(text: string): ComponentChildren[] {
  const output: ComponentChildren[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    // Find the earliest match across all patterns.
    let best: { index: number; match: RegExpMatchArray; type: string } | null =
      null;

    for (const pattern of inlinePatterns) {
      const m = remaining.match(pattern.regex);
      if (
        m != null &&
        m.index != null &&
        (best == null || m.index < best.index)
      ) {
        best = { index: m.index, match: m, type: pattern.type };
      }
    }

    if (best == null) {
      output.push(remaining);
      break;
    }

    // Push any plain text before the match.
    if (best.index > 0) {
      output.push(remaining.slice(0, best.index));
    }

    if (best.type === "link" && best.match[2] != null) {
      const href = sanitizeHref(best.match[2]);
      output.push(<LinkText href={href}>{best.match[1]}</LinkText>);
    } else if (best.type === "bold") {
      output.push(<b>{best.match[1]}</b>);
    } else {
      output.push(<i>{best.match[1]}</i>);
    }

    remaining = remaining.slice(best.index + best.match[0].length);
  }

  return output;
}

function sanitizeHref(href: string) {
  if (/^\s*(javascript:|data:)/i.test(href)) {
    return "#";
  }

  return href;
}
