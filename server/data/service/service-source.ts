import type { Service } from "@/server/data/service/service.js";
import type { Departure } from "@/server/data/service/departure.js";
import type { Tags } from "@/server/data/tags.js";
import type { ServiceServicingMovement } from "@/server/data/service/service-movement.js";

export type DeparturesIterationDirection = "forwards" | "backwards";

export type LightweightDeparture = {
  readonly sourceId: string;
  readonly intrasourceId: string;
  readonly lineIds: readonly number[];
  readonly serviceTags: Tags;
  readonly movement: ServiceServicingMovement;
};

export type DeparturesIterator = {
  peek: () => Promise<LightweightDeparture | null>;
  skip: () => Promise<void>;
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
