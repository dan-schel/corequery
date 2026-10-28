import clsx from "clsx";
import { Column } from "@/web/components/core/Column";
import { MingcuteAlertLine } from "@/web/components/icons/MingcuteAlertLine";
import { TextBlock } from "@/web/components/core/TextBlock";
import type { Icon } from "@/web/components/icons/type";

type ErrorMessageProps = {
  class?: string;
  text: string;
  icon?: Icon;
};

export function ErrorMessage(props: ErrorMessageProps) {
  const Icon = props.icon ?? MingcuteAlertLine;

  return (
    <Column class={clsx(props.class, "gap-3")} xAlign="center">
      {<Icon class="text-icon-xl text-fg" />}
      <TextBlock align="center">{props.text}</TextBlock>
    </Column>
  );
}
