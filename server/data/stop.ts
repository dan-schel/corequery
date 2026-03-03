import type { StopConfig, TagSuccessionConfig } from "@/server/config/index.js";
import { Tags } from "@/server/data/tags.js";
import type { stopFodaSchema } from "@/shared/apis/foundational-data/v1/foundational-data.js";
import type z from "zod";
import { Location } from "@/server/data/location.js";

type StopFields = {
  readonly id: number;
  readonly name: string;
  readonly tags: Tags;
  readonly urlPath: string;
  readonly location: Location | null;
};

export class Stop {
  readonly id: number;
  readonly name: string;
  readonly tags: Tags;
  readonly urlPath: string;
  readonly location: Location | null;

  constructor(fields: StopFields) {
    this.id = fields.id;
    this.name = fields.name;
    this.tags = fields.tags;
    this.urlPath = fields.urlPath;
    this.location = fields.location;
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
      location: Location.buildIfPresent(stopConfig.location),
    });
  }

  with(newValues: Partial<StopFields>): Stop {
    return new Stop({ ...this, ...newValues });
  }

  toFoda(): z.input<typeof stopFodaSchema> {
    return {
      id: this.id,
      name: this.name,
      urlPath: this.urlPath,
      location: this.location?.toFoda() ?? null,
    };
  }

  /** e.g. `"Sandringham" (#1)` */
  get debugName(): string {
    return `"${this.name}" (#${this.id})`;
  }
}
