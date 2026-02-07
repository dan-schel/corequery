import type { LineConfig } from "../../line-config.js";
import type { LintIssue, LineLintOptions } from "../types.js";
import { createIssue, findDuplicates } from "../utils/helpers.js";

export function checkLineRoutesUniqueNames(
  line: LineConfig,
  lineIndex: number,
  options?: LineLintOptions,
): LintIssue[] {
  const issues: LintIssue[] = [];
  const duplicates = findDuplicates(line.routes, (route) => route.name);

  duplicates.forEach((indices, name) => {
    indices.forEach((index) => {
      const route = line.routes[index];
      if (!route || options?.routes?.[route.id]?.ignoreDuplicatedName) {
        return;
      }

      issues.push(
        createIssue(
          `Route name "${name}" is duplicated in line "${line.name}"`,
          `lines[${lineIndex}].routes[${index}].name`,
        ),
      );
    });
  });

  return issues;
}
