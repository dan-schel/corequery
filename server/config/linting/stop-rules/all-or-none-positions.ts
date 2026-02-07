import type { StopConfig } from "../../stop-config.js";
import type { LintIssue, StopLintOptions } from "../types.js";
import { createIssue, allOrNone } from "../utils/helpers.js";

export function checkStopsAllOrNoneHavePositions(
  stops: readonly StopConfig[],
  options?: Record<number, StopLintOptions>,
): LintIssue[] {
  const issues: LintIssue[] = [];

  const stopsToCheck = stops.filter(
    (stop) => !options?.[stop.id]?.ignoreMissingPosition,
  );

  const status = allOrNone(stopsToCheck, (stop) => stop.positions.length > 0);

  if (status === "mixed") {
    stopsToCheck.forEach((stop, index) => {
      if (stop.positions.length === 0) {
        issues.push(
          createIssue(
            `Stop "${stop.name}" has no positions`,
            `stops[${index}].positions`,
          ),
        );
      }
    });
  }

  return issues;
}
