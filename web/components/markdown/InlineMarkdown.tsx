import { renderInlineTokens } from "@/web/components/markdown/parse-inline";
import {
  defaultInlineStyle,
  type InlineStyle,
} from "@/web/components/markdown/style";
import { useMemo } from "preact/hooks";

type InlineMarkdownProps = {
  markdown: string;
  style?: InlineStyle;
};

export function InlineMarkdown(props: InlineMarkdownProps) {
  const style = props.style ?? defaultInlineStyle;

  const content = useMemo(
    () => renderInlineTokens(props.markdown, style),
    [props.markdown, style],
  );

  return <>{content}</>;
}
