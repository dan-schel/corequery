import type { Corequery } from "@/server/corequery.js";
import {
  DepartureFilterType,
  type DepartureFilterFunction,
} from "@/server/data/departure-filters/departure-filter-type.js";
import { parseIntNull } from "@dan-schel/js-utils";

export class LineTagDepartureFilterType<
  CustomContextType,
> extends DepartureFilterType<CustomContextType> {
  constructor(app: Corequery<CustomContextType>) {
    super(app, "line-tag");
  }

  override buildFilterFunction(args: string): DepartureFilterFunction | null {
    const lineTag = parseIntNull(args);
    if (lineTag === null) return null;

    const taggedLines = this._app.lines
      .filter((x) => x.tags.has(lineTag))
      .map((x) => x.id);

    return (departure) =>
      departure.service.lineIds.some((id) => taggedLines.includes(id));
  }
}
