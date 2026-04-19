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
      class={clsx(props.class, "gap-2 min-w-0 py-2", {
        "px-4": props.text != null,
        "min-w-8": props.text == null,
        "min-h-10": !outerPadding,
        "min-h-12": outerPadding,
      })}
      yAlign="center"
    >
      {props.icon != null && <props.icon class="text-fg text-icon-lg" />}
      {props.text != null && (
        <TextBlock class="shrink min-w-0">{props.text}</TextBlock>
      )}
    </Row>
  );
}
