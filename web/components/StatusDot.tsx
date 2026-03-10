import type { ComponentChildren } from "preact";
import { Grid } from "@/web/components/core/Grid";
import clsx from "clsx";

type StatusDotProps = {
  class?: string;
  children?: ComponentChildren;
  value: "error" | "warning" | "success";
};

export function StatusDot(props: StatusDotProps) {
  const colorClass = {
    success: "bg-success-text",
    warning: "bg-warning-text",
    error: "bg-error-text",
  }[props.value];

  return (
    <Grid class={clsx(props.class, "grid-cols-[auto_1fr] gap-2 items-center")}>
      <div class={clsx(colorClass, "w-2 h-2 rounded-full")} />
      {props.children}
    </Grid>
  );
}
