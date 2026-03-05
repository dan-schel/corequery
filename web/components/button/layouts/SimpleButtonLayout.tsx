import type { ComponentChildren } from "preact";
import { Row } from "@/web/components/core/Row";
import { TextBlock } from "@/web/components/core/TextBlock";
import type { Icon } from "@/web/components/icons/type";
import clsx from "clsx";

type SimpleButtonLayoutProps = {
  class?: string;
  icon?: Icon;
  text?: ComponentChildren;
};

export function SimpleButtonLayout(props: SimpleButtonLayoutProps) {
  return (
    <Row
      class={clsx(props.class, "gap-2 h-8", {
        "px-4": props.text != null,
        "min-w-8": props.text == null,
      })}
      yAlign="center"
      xAlign="center"
    >
      {props.icon != null && (
        <props.icon class="text-(--content-color) text-md-icon" />
      )}
      {props.text != null && (
        <TextBlock style="content-color">{props.text}</TextBlock>
      )}
    </Row>
  );
}
