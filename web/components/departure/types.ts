import type { DEPARTURES_V0 } from "@/shared/apis";
import type { ResultOf } from "@/shared/apis/types";

export type DepartureData = ResultOf<
  typeof DEPARTURES_V0
>["departures"][number];

export type DepartureFeedData = {
  title: string;
  departures: DepartureData[];
  loading: boolean;
  isError: boolean;
};
