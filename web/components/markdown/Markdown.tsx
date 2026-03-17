import clsx from "clsx";
import { Column } from "@/web/components/core/Column";
import { parseBlocks } from "@/web/components/markdown/parse-blocks";
import { renderInlineTokens } from "@/web/components/markdown/parse-inline";
import {
  defaultStyle,
  type MarkdownStyle,
} from "@/web/components/markdown/style";

type MarkdownProps = {
  class?: string;
  markdown: string;
  style?: MarkdownStyle;
};

export function Markdown(props: MarkdownProps) {
  const styles = props.style ?? defaultStyle;

  const blocks = parseBlocks(props.markdown);

  return (
    <Column class={clsx(props.class)}>
      {blocks.map((block, index) => {
        const text = renderInlineTokens(block.content);
        const isHeader = block.kind !== "p";
        const prev = index > 0 ? blocks[index - 1] : undefined;
        const prevIsHeader = prev != null ? prev.kind !== "p" : false;

        // Headers get extra top margin (unless they're the first item or
        // following another header). This creates the asymmetric spacing where
        // a header sits closer to the paragraph below it than the one above.
        const mt =
          index === 0 ? "" : isHeader && !prevIsHeader ? "mt-8" : "mt-4";

        const rendered = styles[block.kind](text, index);

        return (
          <div key={index} class={mt}>
            {rendered}
          </div>
        );
      })}
    </Column>
  );
}
