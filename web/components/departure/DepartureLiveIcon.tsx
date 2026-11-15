import {
  generateColoredTextCss,
  type TextColor,
} from "@/web/components/core/ColoredText";
import clsx from "clsx";

export type DepartureLiveIconProps = {
  class?: string;
  dynamicColor: TextColor | null;
};

export function DepartureLiveIcon(props: DepartureLiveIconProps) {
  return (
    <svg
      class={clsx(props.class, "text-fg _dynamic-live-icon")}
      style={generateColoredTextCss(props.dynamicColor)}

      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
    >
      <path
        style="
        fill: none;
        stroke: currentColor;
        stroke-width: 4;
        stroke-linecap: round;
      "
        d="M 4,4 A 16,16 0 0 1 20,20"
        class="outer"
      />
      <path
        style="
        fill: none;
        stroke: currentColor;
        stroke-width: 4;
        stroke-linecap: round;
      "
        d="M 4,12 A 8,8 0 0 1 12,20"
        class="inner"
      />
    </svg>
  );
}
