import type { CorequeryConfig } from "@/server/config/index.js";
import { LineCollection } from "@/server/data/line-collection.js";
import { Line } from "@/server/data/line.js";
import { StopCollection } from "@/server/data/stop-collection.js";
import { Stop } from "@/server/data/stop.js";

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
