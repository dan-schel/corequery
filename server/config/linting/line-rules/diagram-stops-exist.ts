import type { LineConfig } from "../../line-config.js";
import type { StopConfig } from "../../stop-config.js";
import type { LintIssue } from "../types.js";
import { createIssue } from "../utils/helpers.js";

export function checkLineDiagramStopsExist(
  line: LineConfig,
  lineIndex: number,
  stops: readonly StopConfig[],
): LintIssue[] {
  const issues: LintIssue[] = [];
  const stopIds = new Set(stops.map((stop) => stop.id));

  line.diagram.entries.forEach((entry, entryIndex) => {
    entry.stops.forEach((diagramStop, stopIndex) => {
      if (!stopIds.has(diagramStop.stopId)) {
        const entryName = entry.name || `Entry ${entryIndex}`;
        issues.push(
          createIssue(
            `Stop ID ${diagramStop.stopId} in diagram entry "${entryName}" of line "${line.name}" does not exist in the stop list`,
            `lines[${lineIndex}].diagram.entries[${entryIndex}].stops[${stopIndex}].stopId`,
          ),
        );
      }
    });
  });

  return issues;
}
