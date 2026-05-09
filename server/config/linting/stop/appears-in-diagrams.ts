import type { StopConfig } from "@/server/config/types/stop-config.js";
import type { LineConfig } from "@/server/config/types/line-config.js";
import type { StopLintOptions } from "@/server/config/linting/types.js";
import { IssueCollector } from "@/server/config/linting/utils/issue-collector.js";
import { extractStopsFromLineDiagramShape } from "@/server/config/helpers/extract-stops-from-line-diagram-shape.js";

export function checkStopsAppearInDiagrams(
  issues: IssueCollector,
  stops: readonly StopConfig[],
  lines: readonly LineConfig[],
  options: Record<number, StopLintOptions>,
) {
  const stopIdsInDiagrams = new Set<number>();
  for (const line of lines) {
    for (const diagram of line.diagram.entries) {
      const stopIds = extractStopsFromLineDiagramShape(diagram.shape).map(
        (s) => s.stopId,
      );

      for (const stopId of stopIds) {
        stopIdsInDiagrams.add(stopId);
      }
    }
  }

  for (const [index, stop] of stops.entries()) {
    if (options[stop.id]?.ignoreUnusedStop ?? false) continue;

    if (!stopIdsInDiagrams.has(stop.id)) {
      issues.add({
        message: `Stop "${stop.name}" does not appear in any diagram.`,
        path: `stops[${index}]`,
      });
    }
  }
}
