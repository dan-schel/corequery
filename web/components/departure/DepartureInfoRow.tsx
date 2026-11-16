import clsx from "clsx";
import { Row } from "@/web/components/core/Row";
import { TextBlock } from "@/web/components/core/TextBlock";
import type {
  FrontendDepartureTimeStrings,
  FrontendDepartureTimeStringsDelay,
} from "@/web/data/frontend-departure-time-strings";
import { LinesList } from "@/web/components/LinesList";

type DepartureTimeProps = {
  class?: string;
  timeStrings: FrontendDepartureTimeStrings;
  lineIds: readonly number[];
};

export function DepartureInfoRow(props: DepartureTimeProps) {
  return (
    <Row class={clsx(props.class, "gap-1")}>
      {props.timeStrings.delay != null && (
        <>
          <DelayText delay={props.timeStrings.delay} />
          <TextBlock style="departure-info">&bull;</TextBlock>
        </>
      )}
      {props.timeStrings.schedule != null ? (
        <TextBlock style="departure-info" class="shrink min-w-0" oneLine>
          Scheduled for {props.timeStrings.schedule}
        </TextBlock>
      ) : (
        <LinesList style="departure-info" lineIds={props.lineIds} />
      )}
    </Row>
  );
}

type DelayTextProps = {
  delay: FrontendDepartureTimeStringsDelay;
};

function DelayText(props: DelayTextProps) {
  const style = {
    green: "departure-info-success" as const,
    yellow: "departure-info-warning" as const,
    red: "departure-info-error" as const,
  }[props.delay.color];

  return <TextBlock style={style}>{props.delay.text}</TextBlock>;
}
