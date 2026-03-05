import { type ComponentChildren } from "preact";
import clsx from "clsx";
import { Grid } from "@/web/components/core/Grid";

type MobileHeaderProps = {
  class?: string;
  children?: ComponentChildren;
};

export function MobileHeader(props: MobileHeaderProps) {
  return (
    <Grid
      class={clsx(
        props.class,
        "fixed top-0 left-0 right-0 bg-bg-navbar border-b border-soft-border",
      )}
    >
      {props.children}
    </Grid>
  );
}
