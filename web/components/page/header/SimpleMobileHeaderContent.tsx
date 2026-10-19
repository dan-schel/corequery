import clsx from "clsx";
import { TextBlock } from "@/web/components/core/TextBlock";
import { Row } from "@/web/components/core/Row";
import { MingcuteLeftLine } from "@/web/components/icons/MingcuteLeftLine";
import { Button } from "@/web/components/button/Button";

type SimpleMobileHeaderContentProps = {
  class?: string;
  title: string;
  backHref: string | null;
};

export function SimpleMobileHeaderContent(
  props: SimpleMobileHeaderContentProps,
) {
  return (
    <Row
      class={clsx(props.class, "gap-2", {
        "px-4": props.backHref == null,
        "pl-2 pr-4": props.backHref != null,
      })}
      yAlign="center"
    >
      {props.backHref != null && (
        <Button href={props.backHref} icon={MingcuteLeftLine} theme="hover" />
      )}
      <TextBlock style="title">{props.title}</TextBlock>
    </Row>
  );
}
