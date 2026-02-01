import type { CorequeryConfig } from "../config/config.js";
import { Line } from "./line.js";
import { Stop } from "./stop.js";

type FoundationalDataFields = {
  readonly stops: readonly Stop[];
  readonly lines: readonly Line[];
};

export class FoundationalData {
  readonly stops: readonly Stop[];
  readonly lines: readonly Line[];

  constructor(fields: FoundationalDataFields) {
    this.stops = fields.stops;
    this.lines = fields.lines;
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
