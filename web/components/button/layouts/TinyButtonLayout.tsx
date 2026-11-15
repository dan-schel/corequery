import type { ComponentChildren } from "preact";
import { Row } from "@/web/components/core/Row";
import { TextBlock } from "@/web/components/core/TextBlock";
import type { Icon } from "@/web/components/icons/type";
import clsx from "clsx";

type TinyButtonLayoutProps = {
  class?: string;
  icon?: Icon;
  text?: ComponentChildren;
};

export function TinyButtonLayout(props: TinyButtonLayoutProps) {
  return (
    <Row
      class={clsx(props.class, "gap-1 h-5", {
        "px-2": props.text != null,
        "min-w-5": props.text == null,
      })}
      yAlign="center"
      xAlign="center"
    >
      {props.icon != null && <props.icon class="text-fg text-icon-xs" />}
      {props.text != null && (
        <TextBlock style="tiny-narrow">{props.text}</TextBlock>
      )}
    </Row>
  );
}
