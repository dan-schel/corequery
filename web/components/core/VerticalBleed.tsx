import type { ComponentChildren } from "preact";

type VerticalBleedProps = {
  class?: string;
  children?: ComponentChildren;
  heightRem: number;
};

export function VerticalBleed(props: VerticalBleedProps) {
  return (
    <div
      class="flex flex-col justify-center items-stretch"
      style={{ height: `${props.heightRem}rem` }}
    >
      {props.children}
    </div>
  );
}
