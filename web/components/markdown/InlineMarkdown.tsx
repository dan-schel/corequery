import { TextBlock } from "@/web/components/core/TextBlock";
import { renderInlineTokens } from "@/web/components/markdown/parse-inline";
import {
  defaultInlineStyle,
  type InlineStyle,
} from "@/web/components/markdown/style";

type InlineMarkdownProps = {
  class?: string;
  markdown: string;
  style?: InlineStyle;
};

export function InlineMarkdown(props: InlineMarkdownProps) {
  const style = props.style ?? defaultInlineStyle;

  return (
    <TextBlock class={props.class}>
      {renderInlineTokens(props.markdown, style)}
    </TextBlock>
  );
}
