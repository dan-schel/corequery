import clsx from "clsx";
import { Row } from "@/web/components/core/Row";
import { TextBlock } from "@/web/components/core/TextBlock";
import type {
  FrontendServiceMovementTimeStrings,
  FrontendServiceMovementTimeStringsDelay,
} from "@/web/data/service/frontend-service-movement-time-strings";
import { LinesList } from "@/web/components/LinesList";
import { MingcuteAlertDiamondLine } from "@/web/components/icons/MingcuteAlertDiamondLine";
import { VerticalBleed } from "@/web/components/core/VerticalBleed";
import { getTextBoxHeightRem } from "@/web/components/core/TextBoxTrim";
import { useTerminology } from "@/web/hooks/use-terminology";

type DepartureTimeProps = {
  class?: string;
  timeStrings: FrontendServiceMovementTimeStrings;
  lineIds: readonly number[];
  isCancelled: boolean;
};

export function DepartureInfoRow(props: DepartureTimeProps) {
  const { singularServiceTerm } = useTerminology();

  if (props.isCancelled) {
    return (
      <Row class={clsx(props.class, "gap-1")}>
        <VerticalBleed heightRem={getTextBoxHeightRem("text-sm")}>
          <MingcuteAlertDiamondLine class="text-error text-icon-md" />
        </VerticalBleed>
        <TextBlock style="departure-info-error">
          This {singularServiceTerm} has been cancelled
        </TextBlock>
      </Row>
    );
  }

  return (
    <Row class={clsx(props.class)}>
      {props.timeStrings.delay != null && (
        <>
          <DelayText delay={props.timeStrings.delay} />
          <TextBlock class="bullet-margin" style="departure-info">
            &bull;
          </TextBlock>
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
  delay: FrontendServiceMovementTimeStringsDelay;
};

function DelayText(props: DelayTextProps) {
  const style = {
    green: "departure-info-success" as const,
    yellow: "departure-info-warning" as const,
    red: "departure-info-error" as const,
  }[props.delay.color];

  return <TextBlock style={style}>{props.delay.text}</TextBlock>;
}
