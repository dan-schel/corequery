import clsx from "clsx";
import { Column } from "@/web/components/core/Column";
import type { DepartureData } from "@/web/components/departure/types";
import { DepartureListItem } from "@/web/components/departure/DepartureListItem";
import { LoadingSpinner } from "@/web/components/LoadingSpinner";
import { TextBlock } from "@/web/components/core/TextBlock";

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
        <>
          <DepartureListItem key={createKey(departure)} departure={departure} />
          {i < props.departures.length - 1 && (
            <hr class="border-soft-border mx-4" />
          )}
        </>
      ))}
    </Column>
  );
}

function createKey(departure: DepartureData) {
  return `${departure.sourceId}/${departure.intrasourceId}/${departure.movement.index}`;
}
