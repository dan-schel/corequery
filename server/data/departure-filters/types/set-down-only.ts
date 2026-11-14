import type { Corequery } from "@/server/corequery.js";
import {
  DepartureFilterType,
  type DepartureFilterFunction,
} from "@/server/data/departure-filters/departure-filter-type.js";

export class SetDownOnlyDepartureFilterType<
  CustomContextType,
> extends DepartureFilterType<CustomContextType> {
  constructor(app: Corequery<CustomContextType>) {
    super(app, "sdo");
  }

  override buildFilterFunction(args: string): DepartureFilterFunction | null {
    if (args !== "") return null;

    return (departure) =>
      departure.movement.type === "regular" && !departure.movement.picksUp;
  }
}
