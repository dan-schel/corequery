import { FoundationalData } from "../../data/foundational-data.js";
import { checks } from "./checks/index.js";
import { LintingContext } from "./linting-context.js";
import { LintingReporter } from "./linting-reporter.js";
import type { LintableConfig, LintIssue, LintOptions } from "./types.js";

export function lintConfig(
  config: LintableConfig,
  options: LintOptions = {},
): readonly LintIssue[] {
  const issues = determineIssues(config, options);
  handleIssues(issues, options);

  return issues;
}

function determineIssues(
  config: LintableConfig,
  options: LintOptions,
): readonly LintIssue[] {
  const foundationalDataResult = safelyBuildFoundationalData(config);

  if (foundationalDataResult.data != null) {
    const ctx = new LintingContext(
      config,
      options,
      new LintingReporter(),
      foundationalDataResult.data,
    );

    for (const check of checks) {
      ctx.run(check);
    }

    return ctx.reporter.getIssues();
  } else {
    const error = foundationalDataResult.error;
    const message = `Error while building foundational data: ${error}`;
    return [{ scope: null, message: message }];
  }
}

function handleIssues(issues: readonly LintIssue[], options: LintOptions) {
  if (issues.length === 0) return;

  const formattedIssues = issues.map((x) => {
    const prefix = x.scope != null ? `[${x.scope}] ` : "";
    return `- ${prefix}${x.message}`;
  });
  const summary = `Lint issues found:\n\n${formattedIssues.join("\n")}`;

  const throwOnFailure = options.throwOnFailure ?? false;
  const printOnFailure = options.printOnFailure ?? true;

  if (printOnFailure) {
    console.log(summary);
  }

  if (throwOnFailure && printOnFailure) {
    throw new Error("Lint issues found.");
  } else if (throwOnFailure) {
    throw new Error(summary);
  }
}

function safelyBuildFoundationalData(config: LintableConfig) {
  try {
    return { data: FoundationalData.build(config) };
  } catch (e) {
    return { error: e };
  }
}
