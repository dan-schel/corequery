import clsx from "clsx";
import { Column } from "@/web/components/core/Column";
import { parseBlocks } from "@/web/components/markdown/parse-blocks";
import {
  defaultStyle,
  type MarkdownStyle,
} from "@/web/components/markdown/style";
import { InlineMarkdown } from "@/web/components/markdown/InlineMarkdown";
import { useMemo } from "preact/hooks";

type MarkdownProps = {
  class?: string;
  markdown: string;
  style?: MarkdownStyle;
};

export function Markdown(props: MarkdownProps) {
  const style = props.style ?? defaultStyle;

  const content = useMemo(() => {
    return parseBlocks(props.markdown).map((block, index) => {
      const blockStyle = style[block.kind];
      const mt = index === 0 ? "" : blockStyle.marginTop;

      return (
        <div key={index} class={mt}>
          {blockStyle.render(
            <InlineMarkdown style={style} markdown={block.content} />,
            index,
          )}
        </div>
      );
    });
  }, [props.markdown, style]);

  return <Column class={clsx(props.class)}>{content}</Column>;
}
