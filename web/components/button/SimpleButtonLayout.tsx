import type { ComponentChildren } from "preact";
import { Row } from "@/web/components/core/Row";
import { TextBlock } from "@/web/components/core/TextBlock";
import type { Icon } from "@/web/components/icons/type";
import clsx from "clsx";
import { LoadingSpinner } from "@/web/components/LoadingSpinner";
import { Grid } from "@/web/components/core/Grid";

type SimpleButtonLayoutProps = {
  class?: string;
  icon?: Icon;
  text?: ComponentChildren;
  loading?: boolean;
};

export function SimpleButtonLayout(props: SimpleButtonLayoutProps) {
  const loading = props.loading ?? false;

  return (
    <Grid class={clsx("relative", props.class)}>
      <Row
        class={clsx("gap-2 px-4 h-8", { invisible: loading })}
        yAlign="center"
      >
        {props.icon?.({ class: "text-(--content-color) text-md-icon" })}
        <TextBlock style="contentColor">{props.text}</TextBlock>
      </Row>
      {loading && (
        <Row
          class="absolute top-0 left-0 right-0 bottom-0"
          xAlign="center"
          yAlign="center"
        >
          <LoadingSpinner />
        </Row>
      )}
    </Grid>
  );
}
