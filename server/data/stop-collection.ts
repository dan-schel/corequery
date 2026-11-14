import { Collection } from "@/shared/data/collection.js";
import { Stop } from "@/server/data/stop.js";
import type {
  GetCanonicalLinesServingStopConfig,
  GetDefaultDepartureFeedsForStopConfig,
  GetDepartureFiltersForStopConfig,
  StopConfig,
  TagSuccessionConfig,
} from "@/server/config/index.js";

export class StopCollection extends Collection<number, Stop> {
  static build(
    stops: readonly StopConfig[],
    stopTagSuccession: TagSuccessionConfig,
    getCanonicalLinesServingStop: GetCanonicalLinesServingStopConfig,
    getDepartureFiltersForStop: GetDepartureFiltersForStopConfig,
    getDefaultDepartureFeedsForStop: GetDefaultDepartureFeedsForStopConfig,
  ) {
    return new StopCollection(
      stops.map((s) =>
        Stop.build(
          s,
          stopTagSuccession,
          getCanonicalLinesServingStop(s.id),
          getDepartureFiltersForStop(s.id),
          getDefaultDepartureFeedsForStop(s.id),
        ),
      ),
    );
  }

  protected _getID(item: Stop): number {
    return item.id;
  }

  protected _getRequireFailError(id: number): Error {
    return new Error(`No stop with ID #${id}.`);
  }

  protected _getPredicateFailError(): Error {
    return new Error("No matching stop.");
  }
}
