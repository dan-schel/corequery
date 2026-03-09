import clsx from "clsx";
import type { ComponentChildren } from "preact";
import type { Icon } from "@/web/components/icons/type";
import { UilInfoCircle } from "@/web/components/icons/UilInfoCircle";
import { Grid } from "@/web/components/core/Grid";
import { VerticalBleed } from "@/web/components/core/VerticalBleed";
import { getTextBoxHeightRem } from "@/web/components/core/TextBoxTrim";

type AlertProps = {
  class?: string;
  children?: ComponentChildren;
  type: "info" | "error" | "warning" | "success";
  icon?: Icon | null;
};

export function Alert(props: AlertProps) {
  const defaultIcon = {
    info: UilInfoCircle,
    error: UilInfoCircle,
    warning: UilInfoCircle,
    success: UilInfoCircle,
  }[props.type];

  // Specifically check for undefined. If icon is given as `null`, use no icon.
  const Icon = props.icon !== undefined ? props.icon : defaultIcon;

  return (
    <div
      class={
        (clsx(props.class),
        "bg-soft-accent [--color-fg:var(--color-accent-text)] px-4 py-4.5 rounded-sm")
      }
    >
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
