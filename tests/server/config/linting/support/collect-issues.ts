import type { LintIssue } from "../../../../../server/config/linting/types.js";
import { IssueCollector } from "../../../../../server/config/linting/utils/issue-collector.js";

export function collectIssues<TArgs extends unknown[]>(
  rule: (issues: IssueCollector, ...args: TArgs) => void,
  ...args: TArgs
): LintIssue[] {
  const issues = new IssueCollector();
  rule(issues, ...args);
  return issues.getIssues();
}
