import type { LineConfig } from "@/server/config/types/line-config.js";
import type { StopConfig } from "@/server/config/types/stop-config.js";
import { chooseNameForEntry } from "@/server/config/linting/utils/choose-name-for-entry.js";
import { IssueCollector } from "@/server/config/linting/utils/issue-collector.js";

export function checkLineDiagramStopsExist(
  issues: IssueCollector,
  line: LineConfig,
  lineIndex: number,
  stops: readonly StopConfig[],
) {
  const stopIds = new Set(stops.map((stop) => stop.id));

  for (const [entryIndex, entry] of line.diagram.entries.entries()) {
    for (const [stopIndex, diagramStop] of entry.stops.entries()) {
      if (!stopIds.has(diagramStop.stopId)) {
        const entryName = chooseNameForEntry(entry.name, entryIndex);
        issues.add({
          message: `Stop ID ${diagramStop.stopId} in diagram entry ${entryName} of line "${line.name}" does not exist in the stop list.`,
          path: `lines[${lineIndex}].diagram.entries[${entryIndex}].stops[${stopIndex}].stopId`,
        });
      }
    }
  }
}
