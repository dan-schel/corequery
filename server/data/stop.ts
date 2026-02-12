import type { StopConfig, TagSuccessionConfig } from "@/server/config/index.js";
import { Tags } from "@/server/data/tags.js";

type StopFields = {
  readonly id: number;
  readonly name: string;
  readonly tags: Tags;
  readonly urlPath: string;
};

export class Stop {
  readonly id: number;
  readonly name: string;
  readonly tags: Tags;
  readonly urlPath: string;

  constructor(fields: StopFields) {
    this.id = fields.id;
    this.name = fields.name;
    this.tags = fields.tags;
    this.urlPath = fields.urlPath;
  }

  static build(
    stopConfig: StopConfig,
    stopTagSuccession: TagSuccessionConfig,
  ): Stop {
    return new Stop({
      id: stopConfig.id,
      name: stopConfig.name,
      tags: Tags.build(stopConfig.tags, stopTagSuccession),
      urlPath: stopConfig.urlPath,
    });
  }

  with(newValues: Partial<StopFields>): Stop {
    return new Stop({ ...this, ...newValues });
  }

  /** e.g. `"Sandringham" (#1)` */
  get debugName(): string {
    return `"${this.name}" (#${this.id})`;
  }
}
