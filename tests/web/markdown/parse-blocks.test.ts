import { describe, expect, it } from "vitest";
import { parseBlocks } from "@/web/components/markdown/parse-blocks";

describe("Markdown", () => {
  it("parses headings and paragraphs", () => {
    const input = `
# Title
## Subtitle
### Heading
Regular paragraph
    `;
    expect(parseBlocks(input)).toMatchInlineSnapshot(`
      [
        {
          "content": "Title",
          "kind": "h1",
        },
        {
          "content": "Subtitle",
          "kind": "h2",
        },
        {
          "content": "Heading",
          "kind": "h3",
        },
        {
          "content": "Regular paragraph",
          "kind": "p",
        },
      ]
    `);
  });

  it("skips empty lines", () => {
    const input = `
# Title

First paragraph

Second paragraph
    `;
    expect(parseBlocks(input)).toMatchInlineSnapshot(`
      [
        {
          "content": "Title",
          "kind": "h1",
        },
        {
          "content": "First paragraph",
          "kind": "p",
        },
        {
          "content": "Second paragraph",
          "kind": "p",
        },
      ]
    `);
  });

  it("requires a space after hashes for headings", () => {
    expect(parseBlocks("#nospace")).toMatchInlineSnapshot(`
      [
        {
          "content": "#nospace",
          "kind": "p",
        },
      ]
    `);
  });

  it("trims whitespace and strips carriage returns", () => {
    expect(parseBlocks("  # Title  \r\n  paragraph  ")).toMatchInlineSnapshot(`
      [
        {
          "content": "Title",
          "kind": "h1",
        },
        {
          "content": "paragraph",
          "kind": "p",
        },
      ]
    `);
  });

  it("returns empty array for blank input", () => {
    expect(parseBlocks("")).toEqual([]);
    expect(parseBlocks("   \n\n  ")).toEqual([]);
  });
});
