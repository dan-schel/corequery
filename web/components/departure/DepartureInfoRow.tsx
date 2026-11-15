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
          <TextBlock style="small-narrow">&bull;</TextBlock>
        </>
      )}
      {props.timeStrings.schedule != null ? (
        <TextBlock style="small-narrow" class="shrink min-w-0" oneLine>
          Scheduled for {props.timeStrings.schedule}
        </TextBlock>
      ) : (
        <LinesList style="small-narrow" lineIds={props.lineIds} />
      )}
    </Row>
  );
}

type DelayTextProps = {
  delay: FrontendDepartureTimeStringsDelay;
};

function DelayText(props: DelayTextProps) {
  const style = {
    green: "small-narrow-strong-success" as const,
    yellow: "small-narrow-strong-warning" as const,
    red: "small-narrow-strong-error" as const,
  }[props.delay.color];

  return <TextBlock style={style}>{props.delay.text}</TextBlock>;
}
