import type { ComponentChildren } from "preact";
import { Grid } from "@/web/components/core/Grid";
import clsx from "clsx";

type TrafficLightProps = {
  class?: string;
  children?: ComponentChildren;
  color?: "red" | "yellow" | "green";
};

export function TrafficLight(props: TrafficLightProps) {
  return (
    <Grid class={clsx(props.class, "grid-cols-[auto_1fr] gap-2 items-center")}>
      <div class="w-2 h-2 rounded-full bg-accent" />
      {props.children}
    </Grid>
  );
}
