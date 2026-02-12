import type { LineConfig } from "@/server/config/types/line-config.js";
import { chooseNameForEntry } from "@/server/config/linting/utils/choose-name-for-entry.js";
import { IssueCollector } from "@/server/config/linting/utils/issue-collector.js";

export function checkLineDiagramEntriesMinimumStops(
  issues: IssueCollector,
  line: LineConfig,
  lineIndex: number,
) {
  for (const [entryIndex, entry] of line.diagram.entries.entries()) {
    if (entry.stops.length < 2) {
      const entryName = chooseNameForEntry(entry.name, entryIndex);
      issues.add({
        message: `Diagram entry ${entryName} in line "${line.name}" has fewer than 2 stops.`,
        path: `lines[${lineIndex}].diagram.entries[${entryIndex}].stops`,
      });
    }
  }
}
