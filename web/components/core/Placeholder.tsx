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
    // (fs - (fs * 1.5 - 0.38 * 2 * fs)) / 2 / fs = 0.13
    //
    // where:
    // fs = font size in rem
    // 1.5 = line height
    // 0.38 = is the negative margin used in <TextBoxTrim>
    //
    // note that fs cancels out, so it's always 0.13em regardless of font size.
    <Placeholder {...props} class={clsx(props.class, "h-[1em] -my-[0.13em]")} />
  );
}
