import type { LineConfig, TagSuccessionConfig } from "../config/index.js";
import { Tags } from "./tags.js";

type LineFields = {
  readonly id: number;
  readonly name: string;
  readonly tags: Tags;
  readonly urlPath: string;
};

export class Line {
  readonly id: number;
  readonly name: string;
  readonly tags: Tags;
  readonly urlPath: string;

  constructor(fields: LineFields) {
    this.id = fields.id;
    this.name = fields.name;
    this.tags = fields.tags;
    this.urlPath = fields.urlPath;
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
