import type { StopConfig } from "@/server/config/types/stop-config.js";
import type { LineConfig } from "@/server/config/types/line-config.js";
import type { StopLintOptions } from "@/server/config/linting/types.js";
import { IssueCollector } from "@/server/config/linting/utils/issue-collector.js";

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
    if (options?.[stop.id]?.ignoreUnusedStop ?? false) continue;

    if (!stopIdsInRoutes.has(stop.id)) {
      issues.add({
        message: `Stop "${stop.name}" does not appear in any route.`,
        path: `stops[${index}]`,
      });
    }
  }
}
