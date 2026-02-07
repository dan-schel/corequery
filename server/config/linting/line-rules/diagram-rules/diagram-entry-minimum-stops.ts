import type { LineConfig } from "../../../line-config.js";
import type { LintIssue } from "../../types.js";
import { createIssue } from "../../utils/helpers.js";

export function checkLineDiagramEntriesMinimumStops(
  line: LineConfig,
  lineIndex: number,
): LintIssue[] {
  const issues: LintIssue[] = [];

  line.diagram.entries.forEach((entry, entryIndex) => {
    if (entry.stops.length < 2) {
      const entryName = entry.name || `Entry ${entryIndex}`;
      issues.push(
        createIssue(
          `Diagram entry "${entryName}" in line "${line.name}" has fewer than 2 stops`,
          `lines[${lineIndex}].diagram.entries[${entryIndex}].stops`,
        ),
      );
    }
  });

  return issues;
}
