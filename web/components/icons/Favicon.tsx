import clsx from "clsx";
import type { SVGAttributes } from "preact";

// Accept SVGAttributes<SVGSVGElement> to match the interface of the other
// icons.
export function Favicon(props: SVGAttributes<SVGSVGElement>) {
  return (
    <img class={clsx(props.class, "w-[1em] h-[1em]")} src="/favicon.svg" />
  );
}
