import clsx from "clsx";
import { Row } from "@/web/components/core/Row";
import { TextBlock } from "@/web/components/core/TextBlock";
import { type TextColor } from "@/web/components/core/ColoredText";
import { DepartureLiveIcon } from "@/web/components/departure/DepartureLiveIcon";
import type { FrontendServiceMovementTimeStrings } from "@/web/data/service/frontend-service-movement-time-strings";

type DepartureTimeProps = {
  class?: string;
  timeStrings: FrontendServiceMovementTimeStrings;
  serviceColor: TextColor | null;
};

export function DepartureTime(props: DepartureTimeProps) {
  return (
    <Row class={clsx(props.class, "relative gap-1")}>
      {props.timeStrings.struckout != null && (
        <TextBlock style="departure-headline-struckout">
          {props.timeStrings.struckout}
        </TextBlock>
      )}
      {props.timeStrings.primary != null && (
        <TextBlock style="departure-headline" dynamicColor={props.serviceColor}>
          {props.timeStrings.primary}
        </TextBlock>
      )}
      {props.timeStrings.showLiveIcon && (
        <DepartureLiveIcon
          dynamicColor={props.serviceColor}
          class="absolute right-[-0.65rem] -top-2 text-icon-xs"
        />
      )}
    </Row>
  );
}
