import type { LineConfig, TagSuccessionConfig } from "@/server/config/index.js";
import { Tags } from "@/server/data/tags.js";
import type { lineFodaSchema } from "@/shared/apis/foundational-data/v1/foundational-data.js";
import type z from "zod";
import { getHexCodesForColor, type Color } from "@/server/data/color.js";
import { Route } from "@/server/data/route.js";

type LineFields = {
  readonly id: number;
  readonly name: string;
  readonly tags: Tags;
  readonly urlPath: string;
  readonly color: Color | null;
  readonly routes: readonly Route[];
};

export class Line {
  readonly id: number;
  readonly name: string;
  readonly tags: Tags;
  readonly urlPath: string;
  readonly color: Color | null;
  readonly routes: readonly Route[];

  constructor(fields: LineFields) {
    this.id = fields.id;
    this.name = fields.name;
    this.tags = fields.tags;
    this.urlPath = fields.urlPath;
    this.color = fields.color;
    this.routes = fields.routes;
  }

  static build(
    lineConfig: LineConfig,
    lineTagSuccession: TagSuccessionConfig,
    routeTagSuccession: TagSuccessionConfig,
  ): Line {
    return new Line({
      id: lineConfig.id,
      name: lineConfig.name,
      tags: Tags.build(lineConfig.tags, lineTagSuccession),
      urlPath: lineConfig.urlPath,
      color: lineConfig.color,
      routes: lineConfig.routes.map((route) =>
        Route.build(route, routeTagSuccession),
      ),
    });
  }

  toFoda(): z.input<typeof lineFodaSchema> {
    return {
      id: this.id,
      name: this.name,
      urlPath: this.urlPath,
      color: this.color != null ? getHexCodesForColor(this.color) : null,
      diagram: {
        // TODO: Fill these out.
        entries: [],
        fallbackStopList: [],
      },
    };
  }

  with(newValues: Partial<LineFields>): Line {
    return new Line({ ...this, ...newValues });
  }

  /** e.g. `"Sandringham" (#1)` */
  get debugName(): string {
    return `"${this.name}" (#${this.id})`;
  }
}
