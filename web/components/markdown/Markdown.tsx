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
        const text = renderInlineTokens(block.content, styles);
        const blockStyle = styles[block.kind];
        const mt = index === 0 ? "" : blockStyle.marginTop;

        return (
          <div key={index} class={mt}>
            {blockStyle.render(text, index)}
          </div>
        );
      })}
    </Column>
  );
}
