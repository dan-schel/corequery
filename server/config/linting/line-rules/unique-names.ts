import type { LineConfig } from "../../line-config.js";
import type { LintIssue, LineLintOptions } from "../types.js";
import { createIssue, findDuplicates } from "../utils/helpers.js";

export function checkLinesUniqueNames(
  lines: readonly LineConfig[],
  options?: Record<number, LineLintOptions>,
): LintIssue[] {
  const issues: LintIssue[] = [];
  const duplicates = findDuplicates(lines, (line) => line.name);

  duplicates.forEach((indices, name) => {
    indices.forEach((index) => {
      const line = lines[index];
      if (!line || options?.[line.id]?.ignoreDuplicatedName) {
        return;
      }

      issues.push(
        createIssue(
          `Line name "${name}" is duplicated`,
          `lines[${index}].name`,
        ),
      );
    });
  });

  return issues;
}
