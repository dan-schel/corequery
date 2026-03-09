import clsx from "clsx";
import type { ComponentChildren } from "preact";
import type { Icon } from "@/web/components/icons/type";
import { UilInfoCircle } from "@/web/components/icons/UilInfoCircle";
import { Grid } from "@/web/components/core/Grid";
import { VerticalBleed } from "@/web/components/core/VerticalBleed";
import { getTextBoxHeightRem } from "@/web/components/core/TextBoxTrim";
import { MingcuteAlertDiamondLine } from "@/web/components/icons/MingcuteAlertDiamondLine";

type AlertProps = {
  class?: string;
  children?: ComponentChildren;
  type: "info" | "error" | "warning" | "success";
  icon?: Icon | null;
};

export function Alert(props: AlertProps) {
  const defaultIcon = {
    info: UilInfoCircle,
    error: MingcuteAlertDiamondLine,
    warning: UilInfoCircle,
    success: UilInfoCircle,
  }[props.type];

  // Specifically check for undefined. If icon is given as `null`, use no icon.
  const Icon = props.icon !== undefined ? props.icon : defaultIcon;

  const bgColor = {
    info: "bg-soft-accent",
    error: "bg-soft-error",
    warning: "bg-soft-warning",
    success: "bg-soft-success",
  }[props.type];

  const fgColors = {
    info: [
      "[--color-fg:var(--color-accent-text)]",
      "[--color-fg-strong:var(--color-accent-text)]",
      "[--color-fg-weak:var(--color-accent-text)]",
    ],
    error: [
      "[--color-fg:var(--color-error-text)]",
      "[--color-fg-strong:var(--color-error-text)]",
      "[--color-fg-weak:var(--color-error-text)]",
    ],
    warning: [
      "[--color-fg:var(--color-warning-text)]",
      "[--color-fg-strong:var(--color-warning-text)]",
      "[--color-fg-weak:var(--color-warning-text)]",
    ],
    success: [
      "[--color-fg:var(--color-success-text)]",
      "[--color-fg-strong:var(--color-success-text)]",
      "[--color-fg-weak:var(--color-success-text)]",
    ],
  }[props.type];

  return (
    <div class={clsx(props.class, bgColor, fgColors, "px-4 py-4.5 rounded-sm")}>
      <Grid
        class={clsx("gap-2 items-start", {
          "grid-cols-[auto_1fr]": Icon != null,
        })}
      >
        {Icon != null && (
          <VerticalBleed heightRem={getTextBoxHeightRem("text-md")}>
            <Icon class="text-fg text-lg" />
          </VerticalBleed>
        )}
        {props.children}
      </Grid>
    </div>
  );
}
