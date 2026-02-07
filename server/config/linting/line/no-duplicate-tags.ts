import type { LineConfig } from "@/server/config/types/line-config.js";
import { findDuplicates } from "@/server/config/linting/utils/find-duplicates.js";
import { IssueCollector } from "@/server/config/linting/utils/issue-collector.js";

export function checkLineNoDuplicateTags(
  issues: IssueCollector,
  line: LineConfig,
  lineIndex: number,
) {
  const duplicates = findDuplicates(line.tags, (tag) => tag);

  for (const [tag, indices] of duplicates) {
    for (const index of indices) {
      issues.add({
        message: `Tag ${tag} is duplicated in line "${line.name}".`,
        path: `lines[${lineIndex}].tags[${index}]`,
      });
    }
  }
}
