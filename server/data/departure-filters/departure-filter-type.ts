import type { Corequery } from "@/server/corequery.js";
import type { LightweightDeparture } from "@/server/data/service/service-source.js";

export type DepartureFilterFunction = (
  departure: LightweightDeparture,
) => boolean;

export abstract class DepartureFilterType<CustomContextType> {
  constructor(
    protected readonly _app: Corequery<CustomContextType>,
    readonly prefix: string,
  ) {}

  abstract buildFilterFunction(args: string): DepartureFilterFunction | null;
}
