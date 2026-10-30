import type { LineConfig, TagSuccessionConfig } from "@/server/config/index.js";
import { Tags } from "@/server/data/tags.js";
import { type Color } from "@/server/data/color.js";
import { LineDiagram } from "@/server/data/line-diagram.js";

type LineFields = {
  readonly id: number;
  readonly name: string;
  readonly tags: Tags;
  readonly urlPath: string;
  readonly color: Color | null;
  readonly diagram: LineDiagram;
};

export class Line {
  readonly id: number;
  readonly name: string;
  readonly tags: Tags;
  readonly urlPath: string;
  readonly color: Color | null;
  readonly diagram: LineDiagram;

  constructor(fields: LineFields) {
    this.id = fields.id;
    this.name = fields.name;
    this.tags = fields.tags;
    this.urlPath = fields.urlPath;
    this.color = fields.color;
    this.diagram = fields.diagram;
  }

  static build(
    lineConfig: LineConfig,
    lineTagSuccession: TagSuccessionConfig,
  ): Line {
    return new Line({
      id: lineConfig.id,
      name: lineConfig.name,
      tags: Tags.build(lineConfig.tags, lineTagSuccession),
      urlPath: lineConfig.urlPath,
      color: lineConfig.color,
      diagram: LineDiagram.build(lineConfig.diagram),
    });
  }

  with(newValues: Partial<LineFields>): Line {
    return new Line({ ...this, ...newValues });
  }

  /** e.g. `"Sandringham" (#1)` */
  get debugName(): string {
    return `"${this.name}" (#${this.id})`;
  }
}
