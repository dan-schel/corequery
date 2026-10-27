import clsx from "clsx";
import { Grid } from "@/web/components/core/Grid";
import { HoverSquareButtonHousing } from "@/web/components/button/housings/HoverSquareButtonHousing";
import type { DepartureData } from "@/web/components/departure/types";
import { Departure } from "@/web/components/departure/Departure";
import { MingcuteRightLine } from "@/web/components/icons/MingcuteRightLine";

type DepartureListItemProps = {
  class?: string;
  departure: DepartureData;
};

export function DepartureListItem(props: DepartureListItemProps) {
  return (
    <HoverSquareButtonHousing
      class={clsx(props.class)}
      href={createServicePageUrl(props.departure)}
    >
      <Grid class="grid-cols-[1fr_auto] p-4 items-center pr-2 gap-2">
        <Departure departure={props.departure} />
        <MingcuteRightLine class="text-icon-lg text-fg" />
      </Grid>
    </HoverSquareButtonHousing>
  );
}

function createServicePageUrl(departure: DepartureData) {
  const sourceId = encodeURIComponent(departure.sourceId);
  const intrasourceId = encodeURIComponent(departure.intrasourceId);
  const movementIndex = encodeURIComponent(departure.movement.index.toString());
  return `/service/${sourceId}/${intrasourceId}?from=${movementIndex}`;
}
