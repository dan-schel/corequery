import type { LineConfig } from "../../types/line-config.js";
import { IssueCollector } from "../utils/issue-collector.js";

export function checkLineNonEmptyName(
  issues: IssueCollector,
  line: LineConfig,
  lineIndex: number,
) {
  if (line.name.length === 0) {
    issues.add({
      message: "Line name is empty.",
      path: `lines[${lineIndex}].name`,
    });
  }
}
