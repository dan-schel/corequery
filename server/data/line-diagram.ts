import { LineDiagramEntry } from "@/server/data/line-diagram-entry.js";
import type { lineDiagramFodaSchema } from "@/shared/apis/foundational-data/v1/foundational-data.js";
import { unique } from "@dan-schel/js-utils";
import type z from "zod";
import type { LineDiagramConfig } from "@/server/config/index.js";

type LineDiagramFields = {
  readonly entries: LineDiagramEntry[];
};

export class LineDiagram {
  readonly entries: LineDiagramEntry[];

  constructor(fields: LineDiagramFields) {
    this.entries = fields.entries;
  }

  static build(diagram: LineDiagramConfig): LineDiagram {
    return new LineDiagram({
      entries: diagram.entries.map((entry) => LineDiagramEntry.build(entry)),
    });
  }

  toFoda(): z.input<typeof lineDiagramFodaSchema> {
    return {
      entries: this.entries.map((entry) => entry.toFoda()),
      fallbackStopList: this.getFallbackStopList(),
    };
  }

  with(newValues: Partial<LineDiagramFields>): LineDiagram {
    return new LineDiagram({ ...this, ...newValues });
  }

  getFallbackStopList() {
    return unique(this.entries.flatMap((entry) => entry.getFallbackStopList()));
  }
}
