import type {
  LineDiagramEntryConfig,
  LineDiagramShapeConfig,
  LineDiagramStopTypeConfig,
} from "@/server/config/index.js";
import { type Color } from "@/server/data/color.js";
import { unique } from "@dan-schel/js-utils";
import { extractStopsFromLineDiagramShape } from "@/server/config/helpers/extract-stops-from-line-diagram-shape.js";

const includedInStopListMapping: Record<LineDiagramStopTypeConfig, boolean> = {
  "regular": true,
  "always-express": false,
};

type LineDiagramEntryFields = {
  readonly name: string | null;
  readonly color: Color | null;
  readonly shape: LineDiagramShapeConfig;
};

export class LineDiagramEntry {
  readonly name: string | null;
  readonly color: Color | null;
  readonly shape: LineDiagramShapeConfig;

  constructor(fields: LineDiagramEntryFields) {
    this.name = fields.name;
    this.color = fields.color;
    this.shape = fields.shape;
  }

  static build(entryConfig: LineDiagramEntryConfig): LineDiagramEntry {
    return new LineDiagramEntry({
      name: entryConfig.name,
      color: entryConfig.color,
      shape: entryConfig.shape,
    });
  }

  getFallbackStopList() {
    return unique(
      extractStopsFromLineDiagramShape(this.shape)
        .filter((s) => includedInStopListMapping[s.type])
        .map((stop) => stop.stopId),
    );
  }

  with(newValues: Partial<LineDiagramEntryFields>): LineDiagramEntry {
    return new LineDiagramEntry({ ...this, ...newValues });
  }
}
