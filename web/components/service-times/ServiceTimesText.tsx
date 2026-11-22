import clsx from "clsx";
import { Row } from "@/web/components/core/Row";
import { TextBlock } from "@/web/components/core/TextBlock";
import { type TextColor } from "@/web/components/core/ColoredText";
import { DepartureLiveIcon } from "@/web/components/departure/DepartureLiveIcon";
import type { FormattedServiceTimes } from "@/web/components/service-times/formatted-service-times";

const styles = {
  "departure": {
    primaryStyle: "departure-headline-strong" as const,
    struckoutStyle: "departure-headline-struckout" as const,
  },
  "service-page": {
    primaryStyle: "regular" as const,
    struckoutStyle: "struckout" as const,
  },
};

type ServiceTimesTextProps = {
  class?: string;
  times: FormattedServiceTimes;
  dynamicColor?: TextColor | null;
  style: keyof typeof styles;
};

export function ServiceTimesText(props: ServiceTimesTextProps) {
  const style = styles[props.style];

  return (
    <Row class={clsx(props.class, "relative gap-1")}>
      {props.times.struckout != null && (
        <TextBlock style={style.struckoutStyle}>
          {props.times.struckout}
        </TextBlock>
      )}
      {props.times.primary != null && (
        <TextBlock style={style.primaryStyle} dynamicColor={props.dynamicColor}>
          {props.times.primary}
        </TextBlock>
      )}
      {props.times.showLiveIcon && (
        <DepartureLiveIcon
          dynamicColor={props.dynamicColor}
          class="absolute right-[-0.65rem] -top-2 text-icon-xs"
        />
      )}
    </Row>
  );
}
