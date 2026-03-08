import type { ComponentChildren } from "preact";
import { Grid } from "@/web/components/core/Grid";
import clsx from "clsx";

type TrafficLightProps = {
  class?: string;
  children?: ComponentChildren;
  color: "red" | "yellow" | "green";
};

export function TrafficLight(props: TrafficLightProps) {
  const colorClass = {
    green: "bg-status-green",
    yellow: "bg-status-yellow",
    red: "bg-status-red",
  }[props.color];

  return (
    <Grid class={clsx(props.class, "grid-cols-[auto_1fr] gap-2 items-center")}>
      <div class={clsx(colorClass, "w-2 h-2 rounded-full")} />
      {props.children}
    </Grid>
  );
}
