import type { ComponentChildren } from "preact";
import { Grid } from "@/web/components/core/Grid";
import clsx from "clsx";
import { Row } from "@/web/components/core/Row";
import { LoadingSpinner } from "@/web/components/LoadingSpinner";

type ContentOrSpinnerProps = {
  class?: string;
  children?: ComponentChildren;
  loading: boolean;
};

export function ContentOrSpinner(props: ContentOrSpinnerProps) {
  return (
    <Grid class={clsx("relative", props.class)}>
      <Grid class={clsx({ invisible: props.loading })}>{props.children}</Grid>
      {props.loading && (
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
