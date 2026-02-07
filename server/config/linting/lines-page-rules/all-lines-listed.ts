import type { LinesPageConfig } from "../../lines-page-config.js";
import type { LineConfig } from "../../line-config.js";
import type { LinesPageLintOptions } from "../types.js";
import { IssueCollector } from "../utils/issue-collector.js";

export function checkLinesPageAllLinesListed(
  issues: IssueCollector,
  linesPage: LinesPageConfig,
  lines: readonly LineConfig[],
  options?: LinesPageLintOptions,
) {
  if (options?.ignoreUnlistedLine) {
    return;
  }
  const listedLineIds = new Set<number>();

  // TODO: Seems unnecessary to do this in two stages.
  linesPage.sections.forEach((section) => {
    lines.forEach((line) => {
      // TODO: This is not correct, because tags have succession.
      if (line.tags.includes(section.tag)) {
        listedLineIds.add(line.id);
      }
    });
  });

  lines.forEach((line, index) => {
    if (!listedLineIds.has(line.id)) {
      issues.add({
        message: `Line "${line.name}" is not listed in any lines page section`,
        path: `lines[${index}]`,
      });
    }
  });
}
