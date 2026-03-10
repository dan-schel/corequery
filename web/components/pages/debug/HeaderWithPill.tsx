import { Pill, type PillProps } from "@/web/components/Pill";
import { Row } from "@/web/components/core/Row";
import { TextBlock } from "@/web/components/core/TextBlock";
import { VerticalBleed } from "@/web/components/core/VerticalBleed";
import { TextPlaceholder } from "@/web/components/core/Placeholder";
import { getTextBoxHeightRem } from "@/web/components/core/TextBoxTrim";
import clsx from "clsx";

export type HeaderWithPillProps = {
  class?: string;
  header: string;
  pillContent: {
    text: string;
    type: PillProps["type"];
  } | null;
  loading: boolean;
};

export function HeaderWithPill(props: HeaderWithPillProps) {
  return (
    <Row class={clsx(props.class, "gap-x-2 gap-y-3")} wrap>
      <TextBlock style="strong">{props.header}</TextBlock>
      {props.loading && <TextPlaceholder class="w-[20%] text-md" />}
      {!props.loading && props.pillContent != null && (
        <VerticalBleed heightRem={getTextBoxHeightRem("text-md")}>
          <Pill type={props.pillContent.type} text={props.pillContent.text} />
        </VerticalBleed>
      )}
    </Row>
  );
}
