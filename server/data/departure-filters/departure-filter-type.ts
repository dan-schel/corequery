import type { Corequery } from "@/server/corequery.js";
import type { Departure } from "@/server/data/service/departure.js";

export type DepartureFilterFunction = (departure: Departure) => boolean;

export abstract class DepartureFilterType<CustomContextType> {
  constructor(
    protected readonly _app: Corequery<CustomContextType>,
    readonly prefix: string,
  ) {}

  abstract buildFilterFunction(args: string): DepartureFilterFunction | null;
}
