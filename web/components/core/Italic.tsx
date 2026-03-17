import clsx from "clsx";
import type { ComponentChildren } from "preact";

type ItalicProps = {
  class?: string;
  children?: ComponentChildren;
};

export function Italic(props: ItalicProps) {
  return <em class={clsx(props.class)}>{props.children}</em>;
}
