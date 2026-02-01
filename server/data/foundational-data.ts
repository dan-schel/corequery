import type { CorequeryConfig } from "../config/index.js";
import { LineCollection } from "./line-collection.js";
import { Line } from "./line.js";
import { StopCollection } from "./stop-collection.js";
import { Stop } from "./stop.js";

type FoundationalDataFields = {
  readonly stops: readonly Stop[];
  readonly lines: readonly Line[];
};

export class FoundationalData {
  readonly stops: StopCollection;
  readonly lines: LineCollection;

  constructor(fields: FoundationalDataFields) {
    this.stops = new StopCollection(fields.stops);
    this.lines = new LineCollection(fields.lines);
  }

  static build(
    config: Pick<CorequeryConfig, "stops" | "lines" | "tags">,
  ): FoundationalData {
    const { stopTagSuccession, lineTagSuccession } = config.tags;
    const stops = config.stops.map((s) => Stop.build(s, stopTagSuccession));
    const lines = config.lines.map((l) => Line.build(l, lineTagSuccession));

    return new FoundationalData({ stops, lines });
  }

  with(newValues: Partial<FoundationalDataFields>): FoundationalData {
    return new FoundationalData({ ...this, ...newValues });
  }
}
