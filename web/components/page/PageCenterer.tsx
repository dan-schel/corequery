import type { ComponentChildren } from "preact";
import { Grid } from "@/web/components/core/Grid";
import clsx from "clsx";

type PageCentererProps = {
  class?: string;
  children?: ComponentChildren;
};

export function PageCenterer(props: PageCentererProps) {
  return (
    <Grid
      class={clsx(
        props.class,
        "grid-cols-[0px_1fr_0px] widescreen:grid-cols-[1fr_64rem_1fr]",
      )}
    >
      <Grid class="col-start-2">{props.children}</Grid>
    </Grid>
  );
}
