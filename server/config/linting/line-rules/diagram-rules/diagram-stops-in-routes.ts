import type { LineConfig } from "../../../types/line-config.js";
import { IssueCollector } from "../../utils/issue-collector.js";

export function checkLineDiagramStopsInRoutes(
  issues: IssueCollector,
  line: LineConfig,
  lineIndex: number,
) {
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
        issues.add({
          message: `Stop ID ${diagramStop.stopId} in diagram entry "${entryName}" of line "${line.name}" does not exist in any route`,
          path: `lines[${lineIndex}].diagram.entries[${entryIndex}].stops[${stopIndex}].stopId`,
        });
      }
    });
  });
}
