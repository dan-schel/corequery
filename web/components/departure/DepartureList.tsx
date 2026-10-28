import { Column } from "@/web/components/core/Column";
import type { DepartureData } from "@/web/components/departure/types";
import {
  DEPARTURE_LIST_ITEM_HEIGHT_REM,
  DepartureListItem,
} from "@/web/components/departure/DepartureListItem";
import { LoadingSpinner } from "@/web/components/LoadingSpinner";
import { Grid } from "@/web/components/core/Grid";
import type { ComponentChildren } from "preact";
import clsx from "clsx";
import { ErrorMessage } from "@/web/components/ErrorMessage";
import { useTerminology } from "@/web/hooks/use-terminology";
import { MingcuteCalendarXLine } from "@/web/components/icons/MingcuteCalendarXLine";

type DepartureListProps = {
  class?: string;
  departures: DepartureData[];
  queryCount: number;
  loading: boolean;
  isError: boolean;
};

export function DepartureList(props: DepartureListProps) {
  const { pluralServicesTerm } = useTerminology();

  if (props.loading) {
    return (
      <Container
        class={props.class}
        queryCount={props.queryCount}
        centerContent
      >
        <LoadingSpinner />
      </Container>
    );
  }

  if (props.isError) {
    return (
      <Container
        class={clsx(props.class, "gap-2")}
        queryCount={props.queryCount}
        centerContent
      >
        <ErrorMessage text="An error occurred while retrieving departures" />
        {/* TODO: Add a retry button (to the ErrorMessage component). */}
      </Container>
    );
  }

  if (props.departures.length === 0) {
    return (
      <Container
        class={props.class}
        queryCount={props.queryCount}
        centerContent
      >
        <ErrorMessage
          text={`No ${pluralServicesTerm} scheduled`}
          icon={MingcuteCalendarXLine}
        />
      </Container>
    );
  }

  return (
    <Container class={props.class} queryCount={props.queryCount}>
      {props.departures.map((departure, i) => (
        <Grid key={createKey(departure)} class="relative">
          <DepartureListItem departure={departure} />
          {i < props.queryCount - 1 && (
            <hr class="border-soft-border absolute bottom-0 left-0 right-0 mx-4" />
          )}
        </Grid>
      ))}
    </Container>
  );
}

type ContainerProps = {
  class?: string;
  children?: ComponentChildren;
  queryCount: number;
  centerContent?: boolean;
};

function Container(props: ContainerProps) {
  const centerContent = props.centerContent ?? false;

  return (
    <Column
      class={props.class}
      xAlign={centerContent ? "center" : "stretch"}
      yAlign={centerContent ? "center" : "top"}
      dynamicMinHeightRem={DEPARTURE_LIST_ITEM_HEIGHT_REM * props.queryCount}
    >
      {props.children}
    </Column>
  );
}

function createKey(departure: DepartureData) {
  return `${departure.sourceId}/${departure.intrasourceId}/${departure.movement.index}`;
}
