import type { LineDiagram } from "@/server/data/line-diagram.js";
import type { lineDiagramFodaSchema as lineDiagramFodaV1Schema } from "@/shared/apis/foundational-data/v1/foundational-data.js";
import type z from "zod";
import { MultiversionalLineDiagramEntryFoda } from "@/server/api/handlers/foundational-data/multiversional/multiversional-line-diagram-entry-foda.js";

export class MultiversionalLineDiagramFoda {
  constructor(
    readonly obj: ReturnType<typeof MultiversionalLineDiagramFoda._buildObj>,
  ) {}

  static build(diagram: LineDiagram) {
    return new MultiversionalLineDiagramFoda(
      MultiversionalLineDiagramFoda._buildObj(diagram),
    );
  }

  private static _buildObj(diagram: LineDiagram) {
    return {
      entries: diagram.entries.map(
        (entry) => MultiversionalLineDiagramEntryFoda.build(entry).obj,
      ),
      fallbackStopList: diagram.getFallbackStopList(),
    };
  }

  toFodaV1(): z.input<typeof lineDiagramFodaV1Schema> {
    return {
      entries: this.obj.entries.map((entry) =>
        new MultiversionalLineDiagramEntryFoda(entry).toFodaV1(),
      ),
      fallbackStopList: this.obj.fallbackStopList,
    };
  }
}
