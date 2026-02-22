import type { LineConfig } from "@/server/config/types/line-config.js";
import { findDuplicates } from "@/server/config/linting/utils/find-duplicates.js";
import { IssueCollector } from "@/server/config/linting/utils/issue-collector.js";

export function checkLinesUniqueUrlPaths(
  issues: IssueCollector,
  lines: readonly LineConfig[],
) {
  const duplicates = findDuplicates(lines, (line) => line.urlPath);

  for (const [urlPath, indices] of duplicates) {
    for (const index of indices) {
      issues.add({
        message: `Line URL path "${urlPath}" is duplicated.`,
        path: `lines[${index}].urlPath`,
      });
    }
  }
}
