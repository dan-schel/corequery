import type { LineConfig } from "@/server/config/types/line-config.js";
import { findDuplicates } from "@/server/config/linting/utils/find-duplicates.js";
import { IssueCollector } from "@/server/config/linting/utils/issue-collector.js";

export function checkLineRoutesUniqueIds(
  issues: IssueCollector,
  line: LineConfig,
  lineIndex: number,
) {
  const duplicates = findDuplicates(line.routes, (route) => route.id);

  for (const [id, indices] of duplicates) {
    for (const index of indices) {
      issues.add({
        message: `Route ID ${id} is duplicated in line "${line.name}".`,
        path: `lines[${lineIndex}].routes[${index}].id`,
      });
    }
  }
}
