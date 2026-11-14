import type { Corequery } from "@/server/corequery.js";
import {
  DepartureFilterType,
  type DepartureFilterFunction,
} from "@/server/data/departure-filters/departure-filter-type.js";
import { parseIntNull } from "@dan-schel/js-utils";

export class LineDepartureFilterType<
  CustomContextType,
> extends DepartureFilterType<CustomContextType> {
  constructor(app: Corequery<CustomContextType>) {
    super(app, "line");
  }

  override buildFilterFunction(args: string): DepartureFilterFunction | null {
    const lineId = parseIntNull(args);
    if (lineId === null) return null;

    return (departure) => departure.service.lineIds.includes(lineId);
  }
}
