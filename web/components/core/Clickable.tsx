import type { ComponentChildren } from "preact";
import clsx from "clsx";

type ClickableProps = {
  class?: string;
  children?: ComponentChildren;
  onClick?: () => void;
  href?: string;

  // Sometimes you want the semantics of an <a> (e.g. open link in new tab), but
  // still want to run a side-effect when it's clicked. E.g. for the navigation
  // menus, we always want to close the menu when a link is clicked, and
  // `useEffect`ing on URL changes isn't a complete solution because it doesn't
  // work if the menu item clicked is the page you're already on!
  onHrefClick?: () => void;

  disabled?: boolean;
};

export function Clickable(props: ClickableProps) {
  const _class = clsx(
    "grid not-disabled:cursor-pointer select-none",
    props.class,
  );

  if (
    props.onClick == null &&
    props.href != null &&
    !(props.disabled ?? false)
  ) {
    return (
      <a class={_class} href={props.href} onClick={props.onHrefClick}>
        {props.children}
      </a>
    );
  } else {
    return (
      <button class={_class} onClick={props.onClick} disabled={props.disabled}>
        {props.children}
      </button>
    );
  }
}
