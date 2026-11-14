import type {
  DefaultDepartureFeedsConfig,
  DepartureFiltersConfig,
  StopConfig,
  TagSuccessionConfig,
} from "@/server/config/index.js";
import { Tags } from "@/server/data/tags.js";
import { Location } from "@/server/data/location.js";
import { DefaultDepartureFeed } from "@/server/data/default-departure-feed.js";
import { DepartureFilters } from "@/server/data/departure-filters.js";
import { StopPosition } from "@/server/data/stop-position.js";

type StopFields = {
  readonly id: number;
  readonly name: string;
  readonly tags: Tags;
  readonly urlPath: string;
  readonly location: Location | null;
  readonly positions: readonly StopPosition[];

  readonly canonicalLinesServingStop: readonly number[];
  readonly departureFilters: DepartureFilters;
  readonly defaultDepartureFeeds: readonly DefaultDepartureFeed[];
};

export class Stop {
  readonly id: number;
  readonly name: string;
  readonly tags: Tags;
  readonly urlPath: string;
  readonly location: Location | null;
  readonly positions: readonly StopPosition[];

  readonly canonicalLinesServingStop: readonly number[];
  readonly departureFilters: DepartureFilters;
  readonly defaultDepartureFeeds: readonly DefaultDepartureFeed[];

  constructor(fields: StopFields) {
    this.id = fields.id;
    this.name = fields.name;
    this.tags = fields.tags;
    this.urlPath = fields.urlPath;
    this.location = fields.location;
    this.positions = fields.positions;

    this.canonicalLinesServingStop = fields.canonicalLinesServingStop;
    this.departureFilters = fields.departureFilters;
    this.defaultDepartureFeeds = fields.defaultDepartureFeeds;
  }

  static build(
    stopConfig: StopConfig,
    stopTagSuccession: TagSuccessionConfig,
    canonicalLinesServingStop: readonly number[],
    departureFilters: DepartureFiltersConfig,
    defaultDepartureFeeds: DefaultDepartureFeedsConfig,
  ): Stop {
    if (defaultDepartureFeeds.length === 0) {
      throw new Error(`Stop #${stopConfig.id} has no default departure feeds.`);
    }

    const positions = StopPosition.buildAll(stopConfig.positions);

    return new Stop({
      id: stopConfig.id,
      name: stopConfig.name,
      tags: Tags.build(stopConfig.tags, stopTagSuccession),
      urlPath: stopConfig.urlPath,
      location: Location.buildIfPresent(stopConfig.location),
      positions: positions,

      canonicalLinesServingStop,
      departureFilters: DepartureFilters.build(
        departureFilters,
        canonicalLinesServingStop,
        positions,
      ),
      defaultDepartureFeeds: DefaultDepartureFeed.buildAll(
        defaultDepartureFeeds,
      ),
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
