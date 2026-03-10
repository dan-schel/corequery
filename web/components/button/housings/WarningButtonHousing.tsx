import type { ComponentChildren } from "preact";
import { Clickable } from "@/web/components/core/Clickable";
import clsx from "clsx";
import { ContentOrSpinner } from "@/web/components/button/ContentOrSpinner";

type WarningButtonHousingProps = {
  class?: string;
  children?: ComponentChildren;
  onClick?: () => void;
  href?: string;
  onHrefClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
};

const parentStylesArr = [
  "relative",
  "group",

  "not-disabled:[--color-fg:var(--color-on-warning)]",
  "not-disabled:[--color-fg-strong:var(--color-on-warning)]",
  "not-disabled:[--color-fg-weak:var(--color-on-warning)]",
  "disabled:[--color-fg:var(--color-fg-weak)]",
  "disabled:[--color-fg-strong:var(--color-fg-weak)]",
];
const parentStyles = clsx(parentStylesArr);

const backgroundStylesArr = [
  "absolute",

  "z-0",
  "top-0",
  "bottom-0",
  "left-0",
  "right-0",

  "rounded-sm",

  "group-not-disabled:bg-warning",
  "group-not-disabled:group-hover:bg-warning-hover",
  "group-not-disabled:group-active:bg-warning-active",

  "border",
  "group-not-disabled:border-transparent",
  "group-disabled:border-soft-border-disabled",
];
const backgroundStyles = clsx(backgroundStylesArr);

export function WarningButtonHousing(props: WarningButtonHousingProps) {
  return (
    <Clickable
      class={clsx(props.class, parentStyles)}
      onClick={props.onClick}
      href={props.href}
      onHrefClick={props.onHrefClick}
      disabled={(props.disabled ?? false) || (props.loading ?? false)}
    >
      <div class={backgroundStyles} />
      <ContentOrSpinner class="z-1" loading={props.loading ?? false}>
        {props.children}
      </ContentOrSpinner>
    </Clickable>
  );
}
