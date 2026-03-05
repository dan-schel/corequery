import { TextBlock } from "@/web/components/core/TextBlock";
import { Row } from "@/web/components/core/Row";

type SimpleMobileHeaderProps = {
  class?: string;
  title: string;
};

export function SimpleMobileHeader(props: SimpleMobileHeaderProps) {
  return (
    <Row class="pl-4 pr-2" yAlign="center">
      <TextBlock style="subtitle">{props.title}</TextBlock>
    </Row>
  );
}
