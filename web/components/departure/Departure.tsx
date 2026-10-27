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
    <Column
      class={clsx(props.class, "h-14 min-w-0 pl-4 relative")}
      yAlign="space-between"
    >
      <div
        class="absolute left-0 -top-3 -bottom-3 w-1 bg-soft-border"
        style={
          props.departure.color != null
            ? {
                backgroundColor: `light-dark(${props.departure.color.lightModeHexCode}, ${props.departure.color.darkModeHexCode})`,
              }
            : undefined
        }
      ></div>
      <Row xAlign="space-between" class="gap-2">
        <Row yAlign="bottom" class="gap-1 shrink min-w-0">
          <TextBlock style="strong">
            {props.departure.primaryDestinationText}
          </TextBlock>
          <TextBlock style="small-narrow" class="shrink min-w-0" oneLine>
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
