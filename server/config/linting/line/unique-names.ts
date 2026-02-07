import type { LineConfig } from "../../line-config.js";
import type { LineLintOptions } from "../types.js";
import { findDuplicates } from "../utils/helpers.js";
import { IssueCollector } from "../utils/issue-collector.js";

export function checkLinesUniqueNames(
  issues: IssueCollector,
  lines: readonly LineConfig[],
  options?: Record<number, LineLintOptions>,
) {
  const duplicates = findDuplicates(lines, (line) => line.name);

  duplicates.forEach((indices, name) => {
    indices.forEach((index) => {
      const line = lines[index];
      if (!line || options?.[line.id]?.ignoreDuplicatedName) {
        return;
      }

      issues.add({
        message: `Line name "${name}" is duplicated.`,
        path: `lines[${index}].name`,
      });
    });
  });
}
