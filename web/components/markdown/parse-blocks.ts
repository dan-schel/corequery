type BlockKind = "h1" | "h2" | "h3" | "p";

type Block = { readonly kind: BlockKind; readonly content: string };

export function parseBlocks(markdown: string): readonly Block[] {
  return markdown
    .split("\n")
    .map((line) => line.replace(/[\r\t]/g, "").trim())
    .filter((line) => line.length > 0)
    .map((line): Block => {
      const h3 = line.match(/^### (.+)$/);
      if (h3 != null && h3[1] != null) return { kind: "h3", content: h3[1] };

      const h2 = line.match(/^## (.+)$/);
      if (h2 != null && h2[1] != null) return { kind: "h2", content: h2[1] };

      const h1 = line.match(/^# (.+)$/);
      if (h1 != null && h1[1] != null) return { kind: "h1", content: h1[1] };

      return { kind: "p", content: line };
    });
}
