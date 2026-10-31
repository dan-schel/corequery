import type { LineDiagramEntry } from "@/server/data/line-diagram-entry.js";
import type { lineDiagramEntryFodaSchema as lineDiagramEntryFodaV1Schema } from "@/shared/apis/foundational-data/v1/foundational-data.js";
import type z from "zod";
import { getHexCodesForColor } from "@/server/data/color.js";

export class MultiversionalLineDiagramEntryFoda {
  constructor(
    readonly obj: ReturnType<
      typeof MultiversionalLineDiagramEntryFoda._buildObj
    >,
  ) {}

  static build(diagram: LineDiagramEntry) {
    return new MultiversionalLineDiagramEntryFoda(
      MultiversionalLineDiagramEntryFoda._buildObj(diagram),
    );
  }

  private static _buildObj(diagram: LineDiagramEntry) {
    return {
      name: diagram.name,
      color: diagram.color != null ? getHexCodesForColor(diagram.color) : null,
      shape: diagram.shape,
    };
  }

  toFodaV1(): z.input<typeof lineDiagramEntryFodaV1Schema> {
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
      name: this.obj.name,
      color: this.obj.color,
      ...this.obj.shape,
    };
  }
}
