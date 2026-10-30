import type { Line } from "@/server/data/line.js";
import { getHexCodesForColor } from "@/server/data/color.js";
import type { lineFodaSchema as lineFodaV1Schema } from "@/shared/apis/foundational-data/v1/foundational-data.js";
import type z from "zod";
import { MultiversionalLineDiagramFoda } from "@/server/api/handlers/foundational-data/multiversional/multiversional-line-diagram-foda.js";

export class MultiversionalLineFoda {
  constructor(
    readonly obj: ReturnType<typeof MultiversionalLineFoda._buildObj>,
  ) {}

  static build(line: Line) {
    return new MultiversionalLineFoda(MultiversionalLineFoda._buildObj(line));
  }

  private static _buildObj(line: Line) {
    return {
      id: line.id,
      name: line.name,
      urlPath: line.urlPath,
      color: line.color != null ? getHexCodesForColor(line.color) : null,
      diagram: MultiversionalLineDiagramFoda.build(line.diagram).obj,
    };
  }

  toFodaV1(): z.input<typeof lineFodaV1Schema> {
    return {
      id: this.obj.id,
      name: this.obj.name,
      urlPath: this.obj.urlPath,
      color: this.obj.color,
      diagram: new MultiversionalLineDiagramFoda(this.obj.diagram).toFodaV1(),
    };
  }
}
