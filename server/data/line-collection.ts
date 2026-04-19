import { Collection } from "@/shared/data/collection.js";
import { Line } from "@/server/data/line.js";
import type { LineConfig, TagSuccessionConfig } from "@/server/config/index.js";

export class LineCollection extends Collection<number, Line> {
  static build(
    stops: readonly LineConfig[],
    lineTagSuccession: TagSuccessionConfig,
    routeTagSuccession: TagSuccessionConfig,
  ) {
    return new LineCollection(
      stops.map((s) => Line.build(s, lineTagSuccession, routeTagSuccession)),
    );
  }

  protected _getID(item: Line): number {
    return item.id;
  }

  protected _getRequireFailError(id: number): Error {
    return new Error(`No line with ID #${id}.`);
  }

  protected _getPredicateFailError(): Error {
    return new Error("No matching line.");
  }
}
