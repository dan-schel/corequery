import clsx from "clsx";
import { Row } from "@/web/components/core/Row";
import { TextBlock } from "@/web/components/core/TextBlock";
import { type TextColor } from "@/web/components/core/ColoredText";
import type { FrontendServiceTypeTime } from "@/web/data/frontend-departure";
import { DepartureLiveIcon } from "@/web/components/departure/DepartureLiveIcon";
import type { FrontendDepartureTimeStrings } from "@/web/data/frontend-departure-time-strings";

type DepartureTimeProps = {
  class?: string;
  timeType: FrontendServiceTypeTime;
  timeStrings: FrontendDepartureTimeStrings;
  serviceColor: TextColor | null;
};

export function DepartureTime(props: DepartureTimeProps) {
  return (
    <Row class={clsx(props.class, "relative gap-1")}>
      {props.timeStrings.struckout != null && (
        <TextBlock style="struckout-on-raised">
          {props.timeStrings.struckout}
        </TextBlock>
      )}
      <TextBlock style="strong" dynamicColor={props.serviceColor}>
        {props.timeStrings.primary}
      </TextBlock>
      {props.timeType !== "scheduled-time" && (
        <DepartureLiveIcon
          dynamicColor={props.serviceColor}
          class="absolute -right-2.5 -top-1.75 text-icon-xs"
        />
      )}
    </Row>
  );
}
