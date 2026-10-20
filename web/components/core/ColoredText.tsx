import type { ComponentChildren } from "preact";
import clsx from "clsx";

export type TextColor = {
  lightModeHexCode: string;
  darkModeHexCode: string;
};

type ColoredTextProps = {
  class?: string;
  children?: ComponentChildren;
  color?: TextColor | null;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ColoredText(props: ColoredTextProps) {
  if (props.color === null && props.class === null) {
    return props.children;
  }

  // Tailwind classes can't be generated dynamically anyway, so may as well use
  // inline CSS if a color override is set.
  const css = generateColoredTextCss(props.color);

  return (
    <span class={clsx(props.class)} style={css}>
      {props.children}
    </span>
  );
}

export function generateColoredTextCss(color: TextColor | null | undefined) {
  if (color == null) {
    return undefined;
  }

  return {
    color: `light-dark(${color.lightModeHexCode}, ${color.darkModeHexCode})`,
  };
}
