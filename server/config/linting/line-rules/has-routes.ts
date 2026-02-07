import type { LineConfig } from "../../line-config.js";
import type { LintIssue } from "../types.js";
import { createIssue } from "../utils/helpers.js";

export function checkLineHasRoutes(
  line: LineConfig,
  lineIndex: number,
): LintIssue[] {
  const issues: LintIssue[] = [];

  if (line.routes.length === 0) {
    issues.push(
      createIssue(
        `Line "${line.name}" has no routes`,
        `lines[${lineIndex}].routes`,
      ),
    );
  }

  return issues;
}
