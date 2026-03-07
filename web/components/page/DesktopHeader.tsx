import { type ComponentChildren } from "preact";
import clsx from "clsx";
import { Grid } from "@/web/components/core/Grid";

type DesktopHeaderProps = {
  class?: string;
  children?: ComponentChildren;
};

// The (page) header, not be confused with the nav bar, <DesktopNav>.
export function DesktopHeader(props: DesktopHeaderProps) {
  return (
    <Grid class={clsx(props.class, "hidden desktop:block")}>
      {props.children}
    </Grid>
  );
}
