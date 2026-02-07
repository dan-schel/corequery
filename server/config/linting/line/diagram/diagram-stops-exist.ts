import type { LineConfig } from "../../../line-config.js";
import type { StopConfig } from "../../../stop-config.js";
import { IssueCollector } from "../../utils/issue-collector.js";

export function checkLineDiagramStopsExist(
  issues: IssueCollector,
  line: LineConfig,
  lineIndex: number,
  stops: readonly StopConfig[],
) {
  const stopIds = new Set(stops.map((stop) => stop.id));

  line.diagram.entries.forEach((entry, entryIndex) => {
    entry.stops.forEach((diagramStop, stopIndex) => {
      if (!stopIds.has(diagramStop.stopId)) {
        const entryName = entry.name || `Entry ${entryIndex}`;
        issues.add({
          message: `Stop ID ${diagramStop.stopId} in diagram entry "${entryName}" of line "${line.name}" does not exist in the stop list.`,
          path: `lines[${lineIndex}].diagram.entries[${entryIndex}].stops[${stopIndex}].stopId`,
        });
      }
    });
  });
}
