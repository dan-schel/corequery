import clsx from "clsx";
import { Grid } from "@/web/components/core/Grid";
import { TextBlock } from "@/web/components/core/TextBlock";

type PillProps = {
  class?: string;
  type: "info" | "error" | "warning" | "success";
  text: string;
};

export function Pill(props: PillProps) {
  const bgColor = {
    info: "bg-soft-accent",
    error: "bg-soft-error",
    warning: "bg-soft-warning",
    success: "bg-soft-success",
  }[props.type];

  const fgColors = {
    info: "[--color-fg:var(--color-accent-text)]",
    error: "[--color-fg:var(--color-error-text)]",
    warning: "[--color-fg:var(--color-warning-text)]",
    success: "[--color-fg:var(--color-success-text)]",
  }[props.type];

  return (
    <Grid
      class={clsx(props.class, bgColor, fgColors, "px-2 py-1.5 rounded-full")}
    >
      <TextBlock style="small">{props.text}</TextBlock>
    </Grid>
  );
}
