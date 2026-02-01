import { assert } from "vitest";
import { LintableConfig, LintOptions } from "../../../../server/config";
import { LintingCheck } from "../../../../server/config/linting/checks/check";
import { LintingContext } from "../../../../server/config/linting/linting-context";
import { LintingReporter } from "../../../../server/config/linting/linting-reporter";
import { FoundationalData } from "../../../../server/data/foundational-data";

type SetupArgs = {
  check: LintingCheck;
  config: LintableConfig;
  options?: LintOptions;
};

type ExpectedLintIssue = {
  scope?: string;
  message: string;
};

export function expectIssue(
  args: SetupArgs & { issue: ExpectedLintIssue; allowOtherIssues?: boolean },
) {
  const issues = runLinting(args);
  const issuesStr = issues.map((i) => `- [${i.scope}] ${i.message}`).join("\n");
  const issuesListStr = issues.length === 0 ? "<No issues>" : issuesStr;

  const isReported = issues.some(
    (i) =>
      i.message === args.issue.message &&
      (args.issue.scope != null ? i.scope === args.issue.scope : true),
  );

  const scopePrefix = args.issue.scope ? `[${args.issue.scope}] ` : "";
  const issueStr = `${scopePrefix}${args.issue.message}`;
  assert(isReported, `Expecting:\n${issueStr}\n\nGot:\n${issuesListStr}`);

  const allowOtherIssues = args.allowOtherIssues ?? false;
  if (!allowOtherIssues) {
    assert(issues.length === 1, `Expecting just 1 issue, got:\n${issuesStr}`);
  }
}

export function expectNoIssue(args: SetupArgs) {
  const issues = runLinting(args);
  const issuesStr = issues.map((i) => `- [${i.scope}] ${i.message}`).join("\n");

  assert(issues.length === 0, `Unexpected issues reported:\n${issuesStr}`);
}

function runLinting(args: SetupArgs) {
  const { check, config, options: providedOptions } = args;

  const options: LintOptions = providedOptions ?? {};
  const reporter = new LintingReporter();
  const foundationalData = FoundationalData.build(config);
  const ctx = new LintingContext(config, options, reporter, foundationalData);

  ctx.run(check);

  return ctx.reporter.getIssues();
}
