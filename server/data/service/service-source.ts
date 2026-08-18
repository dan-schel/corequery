import type { Service } from "@/server/data/service/service.js";
import type { Departure } from "@/server/data/service/departure.js";

export type DeparturesIterationDirection = "forwards" | "backwards";

export type DeparturesIterator = {
  // Right now we're forming full departure objects, even for the ones we'll end
  // up skipping during filtering. If this turns out to be too slow, we could
  // consider adding lightweight methods like `peekLineIds`, `peekServiceTags`,
  // etc., and then a `skip` method meaning that we'd only `take` a departure
  // once it's passed the filtering stage. Let's see if it's actually an issue
  // first though.
  peek: () => Promise<Departure | null>;
  take: () => Promise<Departure>;
};

export type ServiceSource = {
  readonly sourceId: string;

  getService: (intrasourceId: string) => Promise<Service | null>;

  getDeparturesIterator: (
    stopId: number,
    instant: Temporal.Instant,
    direction: DeparturesIterationDirection,
  ) => DeparturesIterator;
};
