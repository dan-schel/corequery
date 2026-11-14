import type { Corequery } from "@/server/corequery.js";
import {
  DepartureFilterType,
  type DepartureFilterFunction,
} from "@/server/data/departure-filters/departure-filter-type.js";
import { parseIntNull } from "@dan-schel/js-utils";

export class ServiceTagDepartureFilterType<
  CustomContextType,
> extends DepartureFilterType<CustomContextType> {
  constructor(app: Corequery<CustomContextType>) {
    super(app, "service-tag");
  }

  override buildFilterFunction(args: string): DepartureFilterFunction | null {
    const serviceTag = parseIntNull(args);
    if (serviceTag === null) return null;

    return (departure) => departure.service.tags.has(serviceTag);
  }
}
