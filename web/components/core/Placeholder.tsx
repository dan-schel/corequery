import clsx from "clsx";
import type { ComponentChildren } from "preact";

type PlaceholderProps = {
  class?: string;
  children?: ComponentChildren;
};

export function Placeholder(props: PlaceholderProps) {
  return (
    <div
      class={clsx(props.class, "bg-placeholder animate-placeholder-pulse")}
    />
  );
}

export function TextPlaceholder(props: PlaceholderProps) {
  return (
    <Placeholder {...props} class={clsx(props.class, "h-[1em] -my-[0.13em]")} />
  );
}
