import type { StopConfig } from "../../stop-config.js";
import type { LintIssue, StopLintOptions } from "../types.js";
import { createIssue, allOrNone } from "../utils/helpers.js";

export function checkStopsAllOrNoneHaveLocations(
  stops: readonly StopConfig[],
  options?: Record<number, StopLintOptions>,
): LintIssue[] {
  const issues: LintIssue[] = [];

  const stopsToCheck = stops.filter(
    (stop) => !options?.[stop.id]?.ignoreMissingLocation,
  );

  const status = allOrNone(stopsToCheck, (stop) => stop.location !== null);

  if (status === "mixed") {
    stops.forEach((stop, index) => {
      if (
        stop.location === null &&
        !options?.[stop.id]?.ignoreMissingLocation
      ) {
        issues.push(
          createIssue(
            `Stop "${stop.name}" is missing a location (all stops should have locations or none should)`,
            `stops[${index}].location`,
          ),
        );
      }
    });
  }

  return issues;
}
