import type {
  RouteConfig,
  TagSuccessionConfig,
} from "@/server/config/index.js";
import { Tags } from "@/server/data/tags.js";
import type { Color } from "@/server/data/color.js";

type RouteStop = RouteConfig["stops"][number];

type RouteFields = {
  readonly id: number;
  readonly name: string;
  readonly tags: Tags;
  readonly stops: readonly RouteStop[];
  readonly color: Color | null;
};

export class Route {
  readonly id: number;
  readonly name: string;
  readonly tags: Tags;
  readonly stops: readonly RouteStop[];
  readonly color: Color | null;

  constructor(fields: RouteFields) {
    this.id = fields.id;
    this.name = fields.name;
    this.tags = fields.tags;
    this.stops = fields.stops;
    this.color = fields.color;
  }

  static build(
    routeConfig: RouteConfig,
    routeTagSuccession: TagSuccessionConfig,
  ) {
    return new Route({
      id: routeConfig.id,
      name: routeConfig.name,
      tags: Tags.build(routeConfig.tags, routeTagSuccession),
      stops: routeConfig.stops,
      color: routeConfig.color,
    });
  }

  with(newValues: Partial<RouteFields>): Route {
    return new Route({ ...this, ...newValues });
  }

  /** e.g. `"Sandringham to Flinders Street" (#1)` */
  get debugName(): string {
    return `"${this.name}" (#${this.id})`;
  }
}
