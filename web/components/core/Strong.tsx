import clsx from "clsx";
import type { ComponentChildren } from "preact";

type StrongProps = {
  class?: string;
  children?: ComponentChildren;
};

export function Strong(props: StrongProps) {
  return (
    <strong class={clsx(props.class, "text-fg-strong")}>
      {props.children}
    </strong>
  );
}
