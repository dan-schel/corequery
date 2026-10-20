import clsx from "clsx";
import type { DepartureData } from "@/web/components/departure/types";
import { TextBlock } from "@/web/components/core/TextBlock";
import { ColoredText } from "@/web/components/core/ColoredText";
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
    <Column class={clsx(props.class, "h-14")} yAlign="space-between">
      <Row xAlign="space-between">
        <Row yAlign="bottom" class="gap-1">
          <TextBlock style="strong">
            <ColoredText color={props.departure.color}>
              {props.departure.primaryDestinationText}
            </ColoredText>
          </TextBlock>
          <TextBlock style="small-narrow">
            <ColoredText color={props.departure.color}>
              via Train Tracks
            </ColoredText>
          </TextBlock>
        </Row>
        <DepartureTime
          time={props.departure.movement.time}
          formerTime={props.departure.movement.formerTime}
          serviceColor={props.departure.color}
        />
      </Row>
      <Row xAlign="space-between">
        <Column class="gap-3 mt-0.5">
          <TextBlock style="small-narrow">
            The stopping pattern goes here
          </TextBlock>
          <TextBlock style="small-narrow">
            And then this row shows all sorts of stuff
          </TextBlock>
        </Column>
        <Column
          yAlign="space-between"
          class="border-2 px-1.5 py-1 border-soft-border rounded-sm -mb-0.5"
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
