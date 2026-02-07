import type { LineConfig } from "../../../line-config.js";
import type { LintIssue } from "../../types.js";
import { createIssue } from "../../utils/helpers.js";

export function checkLineDiagramStopsInRoutes(
  line: LineConfig,
  lineIndex: number,
): LintIssue[] {
  const issues: LintIssue[] = [];

  const routeStopIds = new Set<number>();
  line.routes.forEach((route) => {
    route.stops.forEach((stop) => {
      routeStopIds.add(stop.stopId);
    });
  });

  line.diagram.entries.forEach((entry, entryIndex) => {
    entry.stops.forEach((diagramStop, stopIndex) => {
      if (!routeStopIds.has(diagramStop.stopId)) {
        const entryName = entry.name || `Entry ${entryIndex}`;
        issues.push(
          createIssue(
            `Stop ID ${diagramStop.stopId} in diagram entry "${entryName}" of line "${line.name}" does not exist in any route`,
            `lines[${lineIndex}].diagram.entries[${entryIndex}].stops[${stopIndex}].stopId`,
          ),
        );
      }
    });
  });

  return issues;
}
