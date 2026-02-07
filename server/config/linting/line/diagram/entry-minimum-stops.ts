import type { LineConfig } from "../../../line-config.js";
import { chooseNameForEntry } from "../../utils/choose-name-for-entry.js";
import { IssueCollector } from "../../utils/issue-collector.js";

export function checkLineDiagramEntriesMinimumStops(
  issues: IssueCollector,
  line: LineConfig,
  lineIndex: number,
) {
  line.diagram.entries.forEach((entry, entryIndex) => {
    if (entry.stops.length < 2) {
      const entryName = chooseNameForEntry(entry.name, entryIndex);
      issues.add({
        message: `Diagram entry ${entryName} in line "${line.name}" has fewer than 2 stops.`,
        path: `lines[${lineIndex}].diagram.entries[${entryIndex}].stops`,
      });
    }
  });
}
