import type { LineConfig } from "../../line-config.js";
import type { LintIssue } from "../types.js";
import { createIssue } from "../utils/helpers.js";

export function checkLineNoDuplicateTags(
  line: LineConfig,
  lineIndex: number,
): LintIssue[] {
  const issues: LintIssue[] = [];
  const seen = new Set<number>();

  line.tags.forEach((tag, tagIndex) => {
    if (seen.has(tag)) {
      issues.push(
        createIssue(
          `Tag ${tag} is duplicated in line "${line.name}"`,
          `lines[${lineIndex}].tags[${tagIndex}]`,
        ),
      );
    }
    seen.add(tag);
  });

  return issues;
}
