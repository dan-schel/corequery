import type { LineConfig } from "../../line-config.js";
import type { LintIssue } from "../types.js";
import { createIssue, findDuplicates } from "../utils/helpers.js";

export function checkLinesUniqueIds(lines: readonly LineConfig[]): LintIssue[] {
  const issues: LintIssue[] = [];
  const duplicates = findDuplicates(lines, (line) => line.id);

  duplicates.forEach((indices, id) => {
    indices.forEach((index) => {
      issues.push(
        createIssue(`Line ID ${id} is duplicated`, `lines[${index}].id`),
      );
    });
  });

  return issues;
}
