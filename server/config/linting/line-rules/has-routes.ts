import type { LineConfig } from "../../line-config.js";
import { IssueCollector } from "../utils/issue-collector.js";

export function checkLineHasRoutes(
  issues: IssueCollector,
  line: LineConfig,
  lineIndex: number,
) {
  if (line.routes.length === 0) {
    issues.add({
      message: `Line "${line.name}" has no routes`,
      path: `lines[${lineIndex}].routes`,
    });
  }
}
