import type {
  LineDiagramEntryConfig,
  LineDiagramStopTypeConfig,
} from "@/server/config/index.js";
import { getHexCodesForColor, type Color } from "@/server/data/color.js";
import type { lineDiagramEntryFodaSchema } from "@/shared/apis/foundational-data/v1/foundational-data.js";
import type z from "zod";

const includedInStopListMapping: Record<LineDiagramStopTypeConfig, boolean> = {
  "regular": true,
  "always-express": false,
};

type LineDiagramStop = LineDiagramEntryConfig["stops"][number];

type LineDiagramEntryFields = {
  readonly name: string | null;
  readonly color: Color | null;
  readonly stops: readonly LineDiagramStop[];
};

export class LineDiagramEntry {
  readonly name: string | null;
  readonly color: Color | null;
  readonly stops: readonly LineDiagramStop[];

  constructor(fields: LineDiagramEntryFields) {
    this.name = fields.name;
    this.color = fields.color;
    this.stops = fields.stops;
  }

  static build(entryConfig: LineDiagramEntryConfig): LineDiagramEntry {
    return new LineDiagramEntry({
      name: entryConfig.name,
      color: entryConfig.color,
      stops: entryConfig.stops,
    });
  }

  toFoda(): z.input<typeof lineDiagramEntryFodaSchema> {
    return {
      type: "linear",
      name: this.name,
      color: this.color != null ? getHexCodesForColor(this.color) : null,
      stops: this.stops.map((stop) => ({
        stopId: stop.stopId,
        type: stop.type,
      })),
    };
  }

  getFallbackStopList() {
    return this.stops
      .filter((s) => includedInStopListMapping[s.type])
      .map((stop) => stop.stopId);
  }

  with(newValues: Partial<LineDiagramEntryFields>): LineDiagramEntry {
    return new LineDiagramEntry({ ...this, ...newValues });
  }
}
