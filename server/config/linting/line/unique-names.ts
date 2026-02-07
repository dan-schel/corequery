import type { LineConfig } from "../../types/line-config.js";
import type { LineLintOptions } from "../types.js";
import { findDuplicates } from "../utils/find-duplicates.js";
import { IssueCollector } from "../utils/issue-collector.js";

export function checkLinesUniqueNames(
  issues: IssueCollector,
  lines: readonly LineConfig[],
  options?: Record<number, LineLintOptions>,
) {
  const duplicates = findDuplicates(lines, (line) => line.name);

  for (const [name, indices] of duplicates) {
    for (const index of indices) {
      const line = lines[index];
      if (!line || options?.[line.id]?.ignoreDuplicatedName) continue;

      issues.add({
        message: `Line name "${name}" is duplicated.`,
        path: `lines[${index}].name`,
      });
    }
  }
}
