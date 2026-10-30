import type { DEPARTURES_V0 } from "@/shared/apis";
import type { ServerResultOf } from "@/shared/apis/types";

export type DepartureData = ServerResultOf<
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
