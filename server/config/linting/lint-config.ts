import { checks } from "./checks/index.js";
import { LintingContext } from "./linting-context.js";
import { LintingReporter } from "./linting-reporter.js";
import type { LintableConfig, LintIssue, LintOptions } from "./types.js";

export function lintConfig(
  config: LintableConfig,
  options: LintOptions = {},
): readonly LintIssue[] {
  const ctx = new LintingContext(config, options, new LintingReporter());

  for (const check of checks) {
    ctx.run(check);
  }

  const issues = ctx.reporter.getIssues();
  const formattedIssues = issues.map((x) => {
    const prefix = x.scope != null ? `[${x.scope}] ` : "";
    return `- ${prefix}${x.message}`;
  });
  const summary = `Lint issues found:\n\n${formattedIssues.join("\n")}`;

  const throwOnFailure = options.throwOnFailure ?? false;
  const printOnFailure = options.printOnFailure ?? true;

  if (issues.length > 0) {
    if (printOnFailure) {
      console.log(summary);
    }

    if (throwOnFailure && printOnFailure) {
      throw new Error("Lint issues found.");
    } else if (throwOnFailure) {
      throw new Error(summary);
    }
  }

  return issues;
}
