import type { StopConfig } from "../../stop-config.js";
import type { StopLintOptions } from "../types.js";
import { findAllOrNoneViolations } from "../utils/find-all-or-none-violations.js";
import { IssueCollector } from "../utils/issue-collector.js";

export function checkStopsAllOrNoneHavePositions(
  issues: IssueCollector,
  stops: readonly StopConfig[],
  options?: Record<number, StopLintOptions>,
) {
  const stopsToCheck = stops.filter(
    (stop) => !options?.[stop.id]?.ignoreMissingPosition,
  );

  const missingPositions = findAllOrNoneViolations(
    stopsToCheck,
    (stop) => stop.positions.length > 0,
  );

  for (const { item: stop, index } of missingPositions ?? []) {
    issues.add({
      message: `Stop "${stop.name}" has no positions.`,
      path: `stops[${index}].positions`,
    });
  }
}
