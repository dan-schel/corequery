import clsx from "clsx";
import { TextBlock } from "@/web/components/core/TextBlock";
import { Column } from "@/web/components/core/Column";
import { Row } from "@/web/components/core/Row";
import { DepartureTime } from "@/web/components/departure/DepartureTime";
import type { FrontendDeparture } from "@/web/data/frontend-departure";
import { useMemo } from "preact/hooks";
import { useNow } from "@/web/hooks/use-now";
import { useFoundationalData } from "@/web/hooks/use-foundational-data";
import { DepartureInfoRow } from "@/web/components/departure/DepartureInfoRow";
import { DeparturePositionIndicator } from "@/web/components/departure/DeparturePositionIndicator";

type DepartureProps = {
  class?: string;
  departure: FrontendDeparture;
};

export const DEPARTURE_HEIGHT_REM = 3.5;

export function Departure(props: DepartureProps) {
  const { currentMinute } = useNow();
  const { foda } = useFoundationalData();

  const timeStrings = useMemo(
    () => props.departure.getTimeStrings(currentMinute, foda.formatTimezone),
    [props.departure, currentMinute, foda.formatTimezone],
  );

  // Departures are fixed at h-14 (3.5rem).
  return (
    <Column class={clsx(props.class, "h-14 min-w-0")} yAlign="space-between">
      <Row xAlign="space-between" class="gap-2 ">
        <Row yAlign="bottom" class="gap-1 shrink min-w-0">
          <TextBlock style="strong" dynamicColor={props.departure.color}>
            {props.departure.primaryDestinationText}
          </TextBlock>
          {props.departure.secondaryDestinationText != null && (
            <TextBlock
              style="small-narrow"
              class="shrink min-w-0"
              dynamicColor={props.departure.color}
              oneLine
            >
              {props.departure.secondaryDestinationText}
            </TextBlock>
          )}
        </Row>
        <DepartureTime
          timeType={props.departure.timeType}
          timeStrings={timeStrings}
          serviceColor={props.departure.color}
        />
      </Row>
      <Row xAlign="space-between" yAlign="bottom">
        <Column class="gap-3 min-w-0 shrink">
          <TextBlock style="small-narrow" oneLine>
            The stopping pattern goes here
          </TextBlock>
          <DepartureInfoRow
            timeStrings={timeStrings}
            lineIds={props.departure.lineIds}
          />
        </Column>
        <DeparturePositionIndicator
          class="-mb-0.5"
          stopId={props.departure.stopId}
          positionId={props.departure.positionId}
        />
      </Row>
    </Column>
  );
}
