import type { LineConfig } from "@/server/config/types/line-config.js";
import { IssueCollector } from "@/server/config/linting/utils/issue-collector.js";

export function checkLineNonEmptyCode(
  issues: IssueCollector,
  line: LineConfig,
  lineIndex: number,
) {
  if (line.code !== null && line.code.length === 0) {
    issues.add({
      message: "Line code is empty.",
      path: `lines[${lineIndex}].code`,
    });
  }
}
