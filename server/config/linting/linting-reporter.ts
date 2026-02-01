import type { LintIssue } from "./types.js";

export class LintingReporter {
  private _currentScope: string[];
  private _issues: { scope: string[]; message: string }[];

  constructor() {
    this._currentScope = [];
    this._issues = [];
  }

  scope(scope: string, fn: () => void) {
    this._currentScope.push(scope);
    fn();
    this._currentScope.pop();
  }

  report(message: string) {
    this._issues.push({ scope: [...this._currentScope], message });
  }

  getIssues(): readonly LintIssue[] {
    return this._issues.map((issue) => ({
      scope: issue.scope.length > 0 ? issue.scope.join("") : null,
      message: issue.message,
    }));
  }
}
