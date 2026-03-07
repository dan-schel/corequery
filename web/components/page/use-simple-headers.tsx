import { TextBlock } from "@/web/components/core/TextBlock";
import { Row } from "@/web/components/core/Row";

type SimpleHeadersProps = {
  class?: string;
  title: string;
};

export function useSimpleHeaders(props: SimpleHeadersProps) {
  return {
    mobileHeader: (
      <Row class="pl-4 pr-2" yAlign="center">
        <TextBlock style="subtitle">{props.title}</TextBlock>
      </Row>
    ),
    desktopHeader: (
      <Row class="pl-4 pr-2" yAlign="center">
        <TextBlock style="subtitle">{props.title}</TextBlock>
      </Row>
    ),
  };
}
