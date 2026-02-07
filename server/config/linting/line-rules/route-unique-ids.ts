import type { LineConfig } from "../../line-config.js";
import type { LintIssue } from "../types.js";
import { createIssue, findDuplicates } from "../utils/helpers.js";

export function checkLineRoutesUniqueIds(
  line: LineConfig,
  lineIndex: number,
): LintIssue[] {
  const issues: LintIssue[] = [];
  const duplicates = findDuplicates(line.routes, (route) => route.id);

  duplicates.forEach((indices, id) => {
    indices.forEach((index) => {
      issues.push(
        createIssue(
          `Route ID ${id} is duplicated in line "${line.name}"`,
          `lines[${lineIndex}].routes[${index}].id`,
        ),
      );
    });
  });

  return issues;
}
