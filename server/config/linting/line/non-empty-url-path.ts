import type { LineConfig } from "@/server/config/types/line-config.js";
import { IssueCollector } from "@/server/config/linting/utils/issue-collector.js";

export function checkLineNonEmptyUrlPath(
  issues: IssueCollector,
  line: LineConfig,
  lineIndex: number,
) {
  if (line.urlPath.length === 0) {
    issues.add({
      message: "Line URL path is empty.",
      path: `lines[${lineIndex}].urlPath`,
    });
  }
}
