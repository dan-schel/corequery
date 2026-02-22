import type { LineConfig } from "@/server/config/types/line-config.js";
import type { LineLintOptions } from "@/server/config/linting/types.js";
import { findDuplicates } from "@/server/config/linting/utils/find-duplicates.js";
import { IssueCollector } from "@/server/config/linting/utils/issue-collector.js";
import { itsOk } from "@dan-schel/js-utils";

export function checkLinesUniqueNames(
  issues: IssueCollector,
  lines: readonly LineConfig[],
  options: Record<number, LineLintOptions>,
) {
  const duplicates = findDuplicates(lines, (line) => line.name);

  for (const [name, indices] of duplicates) {
    for (const index of indices) {
      const line = itsOk(lines[index]);
      if (options[line.id]?.ignoreDuplicatedName ?? false) continue;

      issues.add({
        message: `Line name "${name}" is duplicated.`,
        path: `lines[${index}].name`,
      });
    }
  }
}
