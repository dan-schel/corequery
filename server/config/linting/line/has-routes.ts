import type { LineConfig } from "../../line-config.js";
import type { LineLintOptions } from "../types.js";
import { IssueCollector } from "../utils/issue-collector.js";

export function checkLineHasRoutes(
  issues: IssueCollector,
  line: LineConfig,
  lineIndex: number,
  options?: LineLintOptions,
) {
  if (options?.ignoreMissingRoutes) return;

  if (line.routes.length === 0) {
    issues.add({
      message: `Line "${line.name}" has no routes.`,
      path: `lines[${lineIndex}].routes`,
    });
  }
}
