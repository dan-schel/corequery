import clsx from "clsx";
import { Column } from "@/web/components/core/Column";
import type { DepartureData } from "@/web/components/departure/types";
import { DepartureListItem } from "@/web/components/departure/DepartureListItem";
import { LoadingSpinner } from "@/web/components/LoadingSpinner";
import { TextBlock } from "@/web/components/core/TextBlock";
import { Grid } from "@/web/components/core/Grid";

type DepartureListProps = {
  class?: string;
  departures: DepartureData[];
  loading: boolean;
  isError: boolean;
};

export function DepartureList(props: DepartureListProps) {
  // TODO: Make it prettier. Fix the height based on the number of expected
  // departures. Move the loading spinner, error message, etc. inside the box.
  if (props.loading) {
    return <LoadingSpinner />;
  }

  if (props.isError) {
    return <TextBlock>Error loading departures.</TextBlock>;
  }

  if (props.departures.length === 0) {
    return <TextBlock>No departures found.</TextBlock>;
  }

  return (
    <Column
      class={clsx(
        props.class,
        "bg-bg-raised border border-soft-border rounded-lg overflow-hidden",
      )}
    >
      {props.departures.map((departure, i) => (
        <Grid class="relative">
          <DepartureListItem key={createKey(departure)} departure={departure} />
          {i < props.departures.length - 1 && (
            <hr class="border-soft-border absolute bottom-0 left-0 right-0 mx-4" />
          )}
        </Grid>
      ))}
    </Column>
  );
}

function createKey(departure: DepartureData) {
  return `${departure.sourceId}/${departure.intrasourceId}/${departure.movement.index}`;
}
