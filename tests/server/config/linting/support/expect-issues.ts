import { expect } from "vitest";
import type { LintIssue } from "../../../../../server/config/linting/types.js";

export function expectIssueMessages(
  issues: readonly LintIssue[],
  expected: readonly string[],
): void {
  expect(issues.map((issue) => issue.message)).toEqual([...expected]);
}
