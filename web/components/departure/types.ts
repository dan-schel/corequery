import type { DEPARTURES_V0 } from "@/shared/apis";
import type { ClientFodaSyncedResultOf } from "@/web/hooks/api/types";

export type DepartureData = ClientFodaSyncedResultOf<
  typeof DEPARTURES_V0
>["feeds"][number]["departures"][number];

export type DepartureFeedData = {
  query: {
    // In the future, this will probably be an array of filters, and we'll
    // calculate the title from that.
    title: string;

    desiredCount: number;
  };
  departures: DepartureData[];
  loading: boolean;
  hadError: boolean;
};
