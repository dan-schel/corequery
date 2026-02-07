import type { LineConfig } from "../../../line-config.js";
import { IssueCollector } from "../../utils/issue-collector.js";

export function checkLineDiagramHasEntries(
  issues: IssueCollector,
  line: LineConfig,
  lineIndex: number,
) {
  if (line.diagram.entries.length === 0) {
    issues.add({
      message: `Line "${line.name}" has no diagram entries`,
      path: `lines[${lineIndex}].diagram.entries`,
    });
  }
}
