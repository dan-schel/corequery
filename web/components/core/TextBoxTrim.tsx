import type { ComponentChildren } from "preact";

// Once Firefox supports the `text-box` CSS property, this component can be
// removed and we can add the following to the index.css file instead:
//
// * {
//   text-box: trim-both cap alphabetic;
// }

type TextBoxTrimProps = {
  class?: string;
  children?: ComponentChildren;
};

export function TextBoxTrim(props: TextBoxTrimProps) {
  // Formula for final text box size (in px):
  // (0.9 * 1.5 - 0.38 * 2 * 0.9) * 16
  //
  // 0.9 = font size in rem
  // 1.5 = line height
  // 0.38 = is the negative margin
  // 16 = is the rem to px conversion.
  //
  // Note that this equals 10.656px but in my browser it's actually 10.6667px.
  // My devicePixelRatio is 1.5, so if it rounds 10.656 to the nearest device
  // pixel (15.984 -> 16), then that works out to 10.6667px.

  return <span class="block -mt-[0.38em] -mb-[0.38em]">{props.children}</span>;
}

const textSizes = {
  "text-sm": 0.7,
  "text-md": 0.9,
  "text-mdlg": 1,
  "text-lg": 1.25,
  "text-xl": 1.5,
  "text-2xl": 2,
};

export function getTextBoxHeightRem(fontSize: number | keyof typeof textSizes) {
  const remSize = typeof fontSize === "number" ? fontSize : textSizes[fontSize];
  const lineHeight = 1.5;
  const negativeMargin = 0.38;

  return remSize * lineHeight - negativeMargin * 2 * remSize;
}
