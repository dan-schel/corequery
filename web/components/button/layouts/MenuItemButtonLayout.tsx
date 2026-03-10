import type { ComponentChildren } from "preact";
import { Row } from "@/web/components/core/Row";
import { TextBlock } from "@/web/components/core/TextBlock";
import type { Icon } from "@/web/components/icons/type";
import clsx from "clsx";

type MenuItemButtonLayoutProps = {
  class?: string;
  icon?: Icon;
  text?: ComponentChildren;
  outerPadding?: boolean;
};

export function MenuItemButtonLayout(props: MenuItemButtonLayoutProps) {
  const outerPadding = props.outerPadding ?? false;

  return (
    <Row
      class={clsx(props.class, "gap-2 min-w-0", {
        "px-4": props.text != null,
        "min-w-8": props.text == null,
        "h-10": !outerPadding,
        "h-14": outerPadding,
      })}
      yAlign="center"
    >
      {props.icon != null && <props.icon class="text-fg text-lg" />}
      {props.text != null && <TextBlock>{props.text}</TextBlock>}
    </Row>
  );
}
