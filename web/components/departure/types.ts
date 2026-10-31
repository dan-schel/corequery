import type { DEPARTURES_V0 } from "@/shared/apis";
import type { ClientFodaSyncedResultOf } from "@/web/hooks/api/types";

export type DepartureData = ClientFodaSyncedResultOf<
  typeof DEPARTURES_V0
>["departures"][number];

export type DepartureFeedData = {
  query: {
    // In the future, this will probably be an array of filters, and we'll
    // calculate the title from that.
    title: string;

    count: number;
  };
  departures: DepartureData[];
  loading: boolean;
  isError: boolean;
};
