import type { Corequery } from "@/server/corequery.js";
import {
  DepartureFilterType,
  type DepartureFilterFunction,
} from "@/server/data/departure-filters/departure-filter-type.js";
import { parseIntNull } from "@dan-schel/js-utils";

export class PositionDepartureFilterType<
  CustomContextType,
> extends DepartureFilterType<CustomContextType> {
  constructor(app: Corequery<CustomContextType>) {
    super(app, "position");
  }

  override buildFilterFunction(args: string): DepartureFilterFunction | null {
    const positionId = parseIntNull(args);
    if (positionId === null) return null;

    return (departure) => departure.movement.currentPositionId === positionId;
  }
}
