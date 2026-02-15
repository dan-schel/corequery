import type { LineConfig } from "@/server/config/types/line-config.js";
import type { LineLintOptions } from "@/server/config/linting/types.js";
import { IssueCollector } from "@/server/config/linting/utils/issue-collector.js";

export function checkLineHasRoutes(
  issues: IssueCollector,
  line: LineConfig,
  lineIndex: number,
  options?: LineLintOptions,
) {
  if (options?.ignoreMissingRoutes ?? false) return;

  if (line.routes.length === 0) {
    issues.add({
      message: `Line "${line.name}" has no routes.`,
      path: `lines[${lineIndex}].routes`,
    });
  }
}
