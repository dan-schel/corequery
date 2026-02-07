import type { StopConfig } from "../../stop-config.js";
import type { LineConfig } from "../../line-config.js";
import type { StopLintOptions } from "../types.js";
import { IssueCollector } from "../utils/issue-collector.js";

export function checkStopsAppearInRoutes(
  issues: IssueCollector,
  stops: readonly StopConfig[],
  lines: readonly LineConfig[],
  options?: Record<number, StopLintOptions>,
) {
  const stopIdsInRoutes = new Set<number>();
  for (const line of lines) {
    for (const route of line.routes) {
      for (const stop of route.stops) {
        stopIdsInRoutes.add(stop.stopId);
      }
    }
  }

  for (const [index, stop] of stops.entries()) {
    if (options?.[stop.id]?.ignoreUnusedStop) continue;

    if (!stopIdsInRoutes.has(stop.id)) {
      issues.add({
        message: `Stop "${stop.name}" does not appear in any route.`,
        path: `stops[${index}]`,
      });
    }
  }
}
