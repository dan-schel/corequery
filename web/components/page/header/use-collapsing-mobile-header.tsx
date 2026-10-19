import { TextBlock } from "@/web/components/core/TextBlock";
import { Row } from "@/web/components/core/Row";
import { PageCenterer } from "@/web/components/page/PageCenterer";
import type { ComponentChildren } from "preact";
import { Grid } from "@/web/components/core/Grid";

type CollapsingHeadersProps = {
  class?: string;
  title: string;
  content: ComponentChildren;
};

export function useCollapsingHeaders(props: CollapsingHeadersProps) {
  return {
    hideMobileHeaderWhenScrolledToTop: true,
    mobileHeader: (
      <Row class="px-4" yAlign="center">
        <TextBlock style="title">{props.title}</TextBlock>
      </Row>
    ),
    agnosticHeader: (
      <Grid class="not-desktop:bg-bg-navbar not-desktop:border-b not-desktop:border-soft-border">
        <PageCenterer>
          <Grid class="not-desktop:px-4 desktop:mx-4 desktop:border-b desktop:border-soft-border">
            {props.content}
          </Grid>
        </PageCenterer>
      </Grid>
    ),
  };
}
