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
  return <span class="block -mt-[0.38em] -mb-[0.38em]">{props.children}</span>;
}
