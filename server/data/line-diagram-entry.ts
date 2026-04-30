import type {
  LineDiagramEntryConfig,
  LineDiagramShapeConfig,
  LineDiagramStopTypeConfig,
} from "@/server/config/index.js";
import { getHexCodesForColor, type Color } from "@/server/data/color.js";
import type { lineDiagramEntryFodaSchema } from "@/shared/apis/foundational-data/v1/foundational-data.js";
import { unique } from "@dan-schel/js-utils";
import type z from "zod";
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

  toFoda(): z.input<typeof lineDiagramEntryFodaSchema> {
    // So there's a mismatch between how the config creates line diagrams, with
    // its "shape" field, and how the FODA schema doesn't have a "shape" field,
    // it's all just dumped at the top level. This wasn't intentional, I decided
    // on the schema first, and then when I got around to implementing the
    // config I preferred having a "shape" field, as name and color are common.
    //
    // But, to be fair, maybe it's a good thing? This means if we change other
    // fields (not just the shape), it can be a new "type" in the FODA, and then
    // the frontend gracefully falls back to the fallbackStopList, instead of
    // requiring a breaking change to the FODA schema.
    return {
      name: this.name,
      color: this.color != null ? getHexCodesForColor(this.color) : null,
      ...this.shape,
    };
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
