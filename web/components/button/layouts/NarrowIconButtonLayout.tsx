import type { ComponentChildren } from "preact";
import { Row } from "@/web/components/core/Row";
import { TextBlock } from "@/web/components/core/TextBlock";
import type { Icon } from "@/web/components/icons/type";
import clsx from "clsx";

type NarrowIconButtonLayoutProps = {
  class?: string;
  icon?: Icon;
  text?: ComponentChildren;
};

export function NarrowIconButtonLayout(props: NarrowIconButtonLayoutProps) {
  return (
    <Row
      class={clsx(props.class, "gap-2 h-8 pl-2 pr-3")}
      yAlign="center"
      xAlign="center"
    >
      {props.icon != null && <props.icon class="text-fg text-icon-lg" />}
      {props.text != null && <TextBlock>{props.text}</TextBlock>}
    </Row>
  );
}
