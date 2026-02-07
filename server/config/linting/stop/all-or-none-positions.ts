import type { StopConfig } from "../../stop-config.js";
import type { StopLintOptions } from "../types.js";
import { allOrNone } from "../utils/helpers.js";
import { IssueCollector } from "../utils/issue-collector.js";

export function checkStopsAllOrNoneHavePositions(
  issues: IssueCollector,
  stops: readonly StopConfig[],
  options?: Record<number, StopLintOptions>,
) {
  const stopsToCheck = stops.filter(
    (stop) => !options?.[stop.id]?.ignoreMissingPosition,
  );

  const status = allOrNone(stopsToCheck, (stop) => stop.positions.length > 0);

  if (status === "mixed") {
    stopsToCheck.forEach((stop, index) => {
      if (stop.positions.length === 0) {
        issues.add({
          message: `Stop "${stop.name}" has no positions`,
          path: `stops[${index}].positions`,
        });
      }
    });
  }
}
