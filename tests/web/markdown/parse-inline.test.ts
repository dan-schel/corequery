import { describe, expect, it } from "vitest";
import { renderInlineTokens } from "@/web/components/markdown/parse-inline";
import type { InlineStyle } from "@/web/components/markdown/style";

const testStyle: InlineStyle = {
  bold: (text) => `[b]${serialize(text)}[/b]`,
  italic: (text) => `[i]${serialize(text)}[/i]`,
  link: (text, href) => `[link=${href}]${serialize(text)}[/link]`,
};

function serialize(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(serialize).join("");
  if (value != null && typeof value === "object" && "props" in value) {
    const props = (value as { props: { children?: unknown } }).props;
    return serialize(props.children);
  }
  if (value == null) return "";
  return `${JSON.stringify(value)}`;
}

function render(markdown: string) {
  return serialize(renderInlineTokens(markdown, testStyle));
}

describe("InlineMarkdown", () => {
  it("passes through plain text", () => {
    expect(render("hello world")).toMatchInlineSnapshot(`"hello world"`);
  });

  it("renders bold", () => {
    expect(render("some **bold** text")).toMatchInlineSnapshot(
      `"some [b]bold[/b] text"`,
    );
  });

  it("renders italic with asterisks", () => {
    expect(render("some *italic* text")).toMatchInlineSnapshot(
      `"some [i]italic[/i] text"`,
    );
  });

  it("renders italic with underscores", () => {
    expect(render("some _italic_ text")).toMatchInlineSnapshot(
      `"some [i]italic[/i] text"`,
    );
  });

  it("renders links with https", () => {
    expect(
      render("visit [my site](https://example.com) today"),
    ).toMatchInlineSnapshot(
      `"visit [link=https://example.com]my site[/link] today"`,
    );
  });

  it("renders local links", () => {
    expect(render("visit [my site](/about) today")).toMatchInlineSnapshot(
      `"visit [link=/about]my site[/link] today"`,
    );
  });

  it("ignores links without https", () => {
    expect(render("click [here](javascript:alert(1))")).toMatchInlineSnapshot(
      `"click [here](javascript:alert(1))"`,
    );
  });

  it("renders bold with italic inside", () => {
    expect(render("**bold and _italic_**")).toMatchInlineSnapshot(
      `"[b]bold and [i]italic[/i][/b]"`,
    );
  });

  it("renders bold with italic (asterisks) inside", () => {
    expect(render("**bold and *italic* too**")).toMatchInlineSnapshot(
      `"[b]bold and [i]italic[/i] too[/b]"`,
    );
  });

  it("handles multiple formatting in one line", () => {
    expect(
      render("hello **bold** and *italic* and [link](https://example.com) end"),
    ).toMatchInlineSnapshot(
      `"hello [b]bold[/b] and [i]italic[/i] and [link=https://example.com]link[/link] end"`,
    );
  });

  it("handles adjacent formatting", () => {
    expect(render("**bold***italic*")).toMatchInlineSnapshot(
      `"[b]bold[/b][i]italic[/i]"`,
    );
  });

  it("returns empty array for empty string", () => {
    expect(renderInlineTokens("", testStyle)).toEqual([]);
  });
});
