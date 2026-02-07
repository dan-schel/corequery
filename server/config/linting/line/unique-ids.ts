import type { LineConfig } from "@/server/config/types/line-config.js";
import { findDuplicates } from "@/server/config/linting/utils/find-duplicates.js";
import { IssueCollector } from "@/server/config/linting/utils/issue-collector.js";

export function checkLinesUniqueIds(
  issues: IssueCollector,
  lines: readonly LineConfig[],
) {
  const duplicates = findDuplicates(lines, (line) => line.id);

  for (const [id, indices] of duplicates) {
    for (const index of indices) {
      issues.add({
        message: `Line ID ${id} is duplicated.`,
        path: `lines[${index}].id`,
      });
    }
  }
}
