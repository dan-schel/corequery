import clsx from "clsx";
import type { DepartureData } from "@/web/components/departure/types";
import { TextBlock } from "@/web/components/core/TextBlock";
import { Column } from "@/web/components/core/Column";
import { Row } from "@/web/components/core/Row";
import { DepartureTime } from "@/web/components/departure/DepartureTime";

type DepartureProps = {
  class?: string;
  departure: DepartureData;
};

export function Departure(props: DepartureProps) {
  // Departures are fixed at h-14.
  return (
    <Column class={clsx(props.class, "h-14 min-w-0")} yAlign="space-between">
      <Row xAlign="space-between" class="gap-2 ">
        <Row yAlign="bottom" class="gap-1 shrink min-w-0">
          <TextBlock style="strong" dynamicColor={props.departure.color}>
            {props.departure.primaryDestinationText}
          </TextBlock>
          <TextBlock
            style="small-narrow"
            class="shrink min-w-0"
            dynamicColor={props.departure.color}
            oneLine
          >
            via Train Tracks
          </TextBlock>
        </Row>
        <DepartureTime
          time={props.departure.movement.time}
          formerTime={props.departure.movement.formerTime}
          serviceColor={props.departure.color}
        />
      </Row>
      <Row xAlign="space-between" yAlign="bottom">
        <Column class="gap-3 min-w-0 shrink">
          <TextBlock style="small-narrow" oneLine>
            The stopping pattern goes here
          </TextBlock>
          <Row class="gap-1">
            <TextBlock style="small-narrow-strong-success">Solid</TextBlock>
            <TextBlock style="small-narrow">&bull;</TextBlock>
            <TextBlock style="small-narrow" class="shrink min-w-0" oneLine>
              And then this row shows all sorts of stuff
            </TextBlock>
          </Row>
        </Column>
        <Column
          yAlign="space-between"
          class="border-2 px-1.5 py-1 border-soft-border rounded-sm -mb-0.5 h-8.5"
        >
          <TextBlock style="tiny-narrow" align="center">
            Platform
          </TextBlock>
          <TextBlock style="strong" align="center">
            X
          </TextBlock>
        </Column>
      </Row>
    </Column>
  );
}
