import { TextBlock } from "@/web/components/core/TextBlock";
import { Row } from "@/web/components/core/Row";
import { PageCenterer } from "@/web/components/page/PageCenterer";

type SimpleHeadersProps = {
  class?: string;
  title: string;
};

export function useSimpleHeaders(props: SimpleHeadersProps) {
  return {
    mobileHeader: (
      <Row class="px-4" yAlign="center">
        <TextBlock style="subtitle">{props.title}</TextBlock>
      </Row>
    ),
    desktopHeader: (
      <PageCenterer>
        <Row class="mx-4 py-4 pt-8 border-b border-soft-border">
          <TextBlock style="subtitle">{props.title}</TextBlock>
        </Row>
      </PageCenterer>
    ),
  };
}
