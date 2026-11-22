import clsx from "clsx";
import { Row } from "@/web/components/core/Row";
import { TextBlock } from "@/web/components/core/TextBlock";
import { type TextColor } from "@/web/components/core/ColoredText";
import { DepartureLiveIcon } from "@/web/components/departure/DepartureLiveIcon";
import type { FrontendServiceMovementTimeStrings } from "@/web/data/service/frontend-service-movement-time-strings";

const styles = {
  "departure": {
    primaryStyle: "departure-headline" as const,
    struckoutStyle: "departure-headline-struckout" as const,
  },
  "service-page": {
    primaryStyle: "regular" as const,
    struckoutStyle: "struckout" as const,
  },
};

type DepartureTimeProps = {
  class?: string;
  timeStrings: FrontendServiceMovementTimeStrings;
  dynamicColor?: TextColor | null;
  style: keyof typeof styles;
};

export function DepartureTime(props: DepartureTimeProps) {
  const style = styles[props.style];

  return (
    <Row class={clsx(props.class, "relative gap-1")}>
      {props.timeStrings.struckout != null && (
        <TextBlock style={style.struckoutStyle}>
          {props.timeStrings.struckout}
        </TextBlock>
      )}
      {props.timeStrings.primary != null && (
        <TextBlock style={style.primaryStyle} dynamicColor={props.dynamicColor}>
          {props.timeStrings.primary}
        </TextBlock>
      )}
      {props.timeStrings.showLiveIcon && (
        <DepartureLiveIcon
          dynamicColor={props.dynamicColor}
          class="absolute right-[-0.65rem] -top-2 text-icon-xs"
        />
      )}
    </Row>
  );
}
