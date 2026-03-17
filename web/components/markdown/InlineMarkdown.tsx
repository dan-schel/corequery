import { TextBlock } from "@/web/components/core/TextBlock";
import { renderInlineTokens } from "@/web/components/markdown/parse-inline";

type InlineMarkdownProps = {
  class?: string;
  markdown: string;
};

export function InlineMarkdown(props: InlineMarkdownProps) {
  return (
    <TextBlock class={props.class}>
      {renderInlineTokens(props.markdown)}
    </TextBlock>
  );
}
