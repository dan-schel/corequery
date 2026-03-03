import { Collection } from "@/server/data/collection.js";
import { Stop } from "@/server/data/stop.js";
import type { StopConfig, TagSuccessionConfig } from "@/server/config/index.js";

export class StopCollection extends Collection<number, Stop> {
  constructor(data: readonly Stop[]) {
    super(data);
  }

  static build(
    stops: readonly StopConfig[],
    stopTagSuccession: TagSuccessionConfig,
  ) {
    return new StopCollection(
      stops.map((s) => Stop.build(s, stopTagSuccession)),
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
