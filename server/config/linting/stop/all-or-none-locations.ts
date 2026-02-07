import type { StopConfig } from "../../stop-config.js";
import type { StopLintOptions } from "../types.js";
import { allOrNone } from "../utils/helpers.js";
import { IssueCollector } from "../utils/issue-collector.js";

export function checkStopsAllOrNoneHaveLocations(
  issues: IssueCollector,
  stops: readonly StopConfig[],
  options?: Record<number, StopLintOptions>,
) {
  const stopsToCheck = stops.filter(
    (stop) => !options?.[stop.id]?.ignoreMissingLocation,
  );

  const status = allOrNone(stopsToCheck, (stop) => stop.location !== null);

  if (status === "mixed") {
    stopsToCheck.forEach((stop, index) => {
      if (stop.location === null) {
        issues.add({
          message: `Stop "${stop.name}" is missing a location`,
          path: `stops[${index}].location`,
        });
      }
    });
  }
}
