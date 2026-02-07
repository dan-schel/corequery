import type { LinesPageConfig } from "../../lines-page-config.js";
import type { LineConfig } from "../../line-config.js";
import type { LintIssue, LinesPageLintOptions } from "../types.js";
import { createIssue } from "../utils/helpers.js";

export function checkLinesPageAllLinesListed(
  linesPage: LinesPageConfig,
  lines: readonly LineConfig[],
  options?: LinesPageLintOptions,
): LintIssue[] {
  if (options?.ignoreUnlistedLine) {
    return [];
  }

  const issues: LintIssue[] = [];
  const listedLineIds = new Set<number>();

  linesPage.sections.forEach((section) => {
    lines.forEach((line) => {
      if (line.tags.includes(section.tag)) {
        listedLineIds.add(line.id);
      }
    });
  });

  lines.forEach((line, index) => {
    if (!listedLineIds.has(line.id)) {
      issues.push(
        createIssue(
          `Line "${line.name}" is not listed in any lines page section`,
          `lines[${index}]`,
        ),
      );
    }
  });

  return issues;
}
