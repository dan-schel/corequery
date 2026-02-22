import type {
  LintableConfig,
  LintIssue,
  LintOptions,
} from "@/server/config/linting/types.js";
import { IssueCollector } from "@/server/config/linting/utils/issue-collector.js";
import { checkTagsNoDuplicatesInSuccession } from "@/server/config/linting/tags/no-duplicates-in-succession.js";
import { lintLineConfig } from "@/server/config/linting/line/index.js";
import { lintLinesPageConfig } from "@/server/config/linting/lines-page/index.js";
import { lintStopConfig } from "@/server/config/linting/stop/index.js";

export function lintConfig(
  config: LintableConfig,
  options?: LintOptions,
): LintIssue[] {
  const issues = new IssueCollector();

  lintStopConfig(issues, config.stops, config.lines, options?.stops ?? {});

  lintLineConfig(issues, config.lines, config.stops, options?.lines ?? {});

  lintLinesPageConfig(
    issues,
    config.linesPage,
    config.lines,
    config.tags.lineTagSuccession,
    options?.linesPage ?? {},
  );

  checkTagsNoDuplicatesInSuccession(issues, config.tags);

  return issues.getIssues();
}
