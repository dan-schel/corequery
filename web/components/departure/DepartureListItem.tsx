import clsx from "clsx";
import { Grid } from "@/web/components/core/Grid";
import { HoverSquareButtonHousing } from "@/web/components/button/housings/HoverSquareButtonHousing";
import {
  Departure,
  DEPARTURE_HEIGHT_REM,
} from "@/web/components/departure/Departure";
import { MingcuteRightLine } from "@/web/components/icons/MingcuteRightLine";
import type { FrontendDeparture } from "@/web/data/frontend-departure";

type DepartureListItemProps = {
  class?: string;
  departure: FrontendDeparture;
};

export const DEPARTURE_LIST_ITEM_HEIGHT_REM = DEPARTURE_HEIGHT_REM + 2;

export function DepartureListItem(props: DepartureListItemProps) {
  return (
    <HoverSquareButtonHousing
      class={clsx(props.class)}
      href={props.departure.servicePageUrl}
    >
      <Grid class="grid-cols-[1fr_auto] p-4 items-center pr-2 gap-2">
        <Departure departure={props.departure} />
        <MingcuteRightLine class="text-icon-lg text-fg" />
      </Grid>
    </HoverSquareButtonHousing>
  );
}
