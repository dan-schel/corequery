import type { LineConfig } from "@/server/config/types/line-config.js";
import type { LineLintOptions } from "@/server/config/linting/types.js";
import { chooseNameForEntry } from "@/server/config/linting/utils/choose-name-for-entry.js";
import { IssueCollector } from "@/server/config/linting/utils/issue-collector.js";

export function checkLineDiagramStopsInRoutes(
  issues: IssueCollector,
  line: LineConfig,
  lineIndex: number,
  options?: LineLintOptions,
) {
  if (options?.ignoreDiagramStopNotInRoute ?? false) return;

  const routeStopIds = new Set<number>();
  for (const route of line.routes) {
    for (const stop of route.stops) {
      routeStopIds.add(stop.stopId);
    }
  }

  for (const [entryIndex, entry] of line.diagram.entries.entries()) {
    for (const [stopIndex, diagramStop] of entry.stops.entries()) {
      if (!routeStopIds.has(diagramStop.stopId)) {
        const entryName = chooseNameForEntry(entry.name, entryIndex);
        issues.add({
          message: `Stop ID ${diagramStop.stopId} in diagram entry ${entryName} of line "${line.name}" does not exist in any route.`,
          path: `lines[${lineIndex}].diagram.entries[${entryIndex}].stops[${stopIndex}].stopId`,
        });
      }
    }
  }
}
