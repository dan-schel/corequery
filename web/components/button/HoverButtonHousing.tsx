import type { ComponentChildren } from "preact";
import { Clickable } from "@/web/components/core/Clickable";
import clsx from "clsx";
import { ContentOrSpinner } from "@/web/components/button/ContentOrSpinner";

type HoverButtonHousingProps = {
  class?: string;
  children?: ComponentChildren;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  loading?: boolean;
};

const parentStylesArr = [
  "relative",
  "group",

  "not-disabled:[--content-color:var(--color-fg)]",
  "disabled:[--content-color:var(--color-fg-weak)]",
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

  "group-not-disabled:bg-transparent",
  "group-not-disabled:group-hover:bg-soft-hover",
  "group-not-disabled:group-active:bg-soft-active",
];
const backgroundStyles = clsx(backgroundStylesArr);

export function HoverButtonHousing(props: HoverButtonHousingProps) {
  return (
    <Clickable
      class={clsx(props.class, parentStyles)}
      onClick={props.onClick}
      href={props.href}
      disabled={(props.disabled ?? false) || (props.loading ?? false)}
    >
      <div class={backgroundStyles} />
      <ContentOrSpinner class="z-1" loading={props.loading ?? false}>
        {props.children}
      </ContentOrSpinner>
    </Clickable>
  );
}
