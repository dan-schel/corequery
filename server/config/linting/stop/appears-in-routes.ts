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
  lines.forEach((line) => {
    line.routes.forEach((route) => {
      route.stops.forEach((stop) => {
        stopIdsInRoutes.add(stop.stopId);
      });
    });
  });

  stops.forEach((stop, index) => {
    if (options?.[stop.id]?.ignoreUnusedStop) {
      return;
    }

    if (!stopIdsInRoutes.has(stop.id)) {
      issues.add({
        message: `Stop "${stop.name}" does not appear in any route.`,
        path: `stops[${index}]`,
      });
    }
  });
}
