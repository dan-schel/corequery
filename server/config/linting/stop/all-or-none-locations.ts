import type { StopConfig } from "../../stop-config.js";
import type { StopLintOptions } from "../types.js";
import { findAllOrNoneViolations } from "../utils/find-all-or-none-violations.js";
import { IssueCollector } from "../utils/issue-collector.js";

export function checkStopsAllOrNoneHaveLocations(
  issues: IssueCollector,
  stops: readonly StopConfig[],
  options?: Record<number, StopLintOptions>,
) {
  const stopsToCheck = stops.filter(
    (stop) => !options?.[stop.id]?.ignoreMissingLocation,
  );

  const missingLocations = findAllOrNoneViolations(
    stopsToCheck,
    (stop) => stop.location !== null,
  );

  for (const { item: stop, index } of missingLocations ?? []) {
    issues.add({
      message: `Stop "${stop.name}" is missing a location.`,
      path: `stops[${index}].location`,
    });
  }
}
