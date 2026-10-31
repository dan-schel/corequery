import type { DEPARTURES_V0 } from "@/shared/apis";
import type { ClientResultOf } from "@/web/hooks/api/types";

export type DepartureData = ClientResultOf<
  typeof DEPARTURES_V0
>["innerResult"]["departures"][number];

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
