import clsx from "clsx";
import { Row } from "@/web/components/core/Row";
import { TextBlock } from "@/web/components/core/TextBlock";
import type { FormattedServiceTimes } from "@/web/components/service-times/formatted-service-times";
import { LinesList } from "@/web/components/LinesList";
import { MingcuteAlertDiamondLine } from "@/web/components/icons/MingcuteAlertDiamondLine";
import { VerticalBleed } from "@/web/components/core/VerticalBleed";
import { getTextBoxHeightRem } from "@/web/components/core/TextBoxTrim";
import { useTerminology } from "@/web/hooks/use-terminology";
import { ServiceDelayText } from "@/web/components/service-times/ServiceDelayText";

type DepartureTimeProps = {
  class?: string;
  times: FormattedServiceTimes;
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
      {props.times.delay != null && (
        <>
          <ServiceDelayText delay={props.times.delay} />
          <TextBlock class="bullet-margin" style="departure-info">
            &bull;
          </TextBlock>
        </>
      )}
      {props.times.schedule != null ? (
        <TextBlock style="departure-info" class="shrink min-w-0" oneLine>
          Scheduled for {props.times.schedule}
        </TextBlock>
      ) : (
        <LinesList style="departure-info" lineIds={props.lineIds} />
      )}
    </Row>
  );
}
