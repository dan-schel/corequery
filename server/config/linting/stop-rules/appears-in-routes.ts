import type { StopConfig } from "../../stop-config.js";
import type { LineConfig } from "../../line-config.js";
import type { LintIssue, StopLintOptions } from "../types.js";
import { createIssue } from "../utils/helpers.js";

export function checkStopsAppearInRoutes(
  stops: readonly StopConfig[],
  lines: readonly LineConfig[],
  options?: Record<number, StopLintOptions>,
): LintIssue[] {
  const issues: LintIssue[] = [];

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
      issues.push(
        createIssue(
          `Stop "${stop.name}" does not appear in any route`,
          `stops[${index}]`,
        ),
      );
    }
  });

  return issues;
}
