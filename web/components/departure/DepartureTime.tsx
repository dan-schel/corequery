import clsx from "clsx";
import { Row } from "@/web/components/core/Row";
import { TextBlock } from "@/web/components/core/TextBlock";
import { type TextColor } from "@/web/components/core/ColoredText";

type DepartureTimeProps = {
  class?: string;
  time: string;
  formerTime: string | null;
  // TODO: timeType, to know whether to show the wifi-ish symbol thingo.
  serviceColor: TextColor | null;
};

export function DepartureTime(props: DepartureTimeProps) {
  return (
    <Row class={clsx(props.class)}>
      <TextBlock style="strong" dynamicColor={props.serviceColor}>
        {props.time}
      </TextBlock>
    </Row>
  );
}
