import type { LintIssue } from "../types.js";

export class IssueCollector {
  private _issues: LintIssue[];

  constructor() {
    this._issues = [];
  }

  add(issue: LintIssue): void {
    this._issues.push(issue);
  }

  getIssues(): LintIssue[] {
    return this._issues;
  }
}
