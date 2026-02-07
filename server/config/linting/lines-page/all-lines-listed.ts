import type { LinesPageConfig } from "../../lines-page-config.js";
import type { LineConfig } from "../../line-config.js";
import type { TagSuccessionConfig } from "../../tags-config.js";
import { Tags } from "../../../data/tags.js";
import type { LinesPageLineLintOptions } from "../types.js";
import { IssueCollector } from "../utils/issue-collector.js";

export function checkLinesPageAllLinesListed(
  issues: IssueCollector,
  linesPage: LinesPageConfig,
  lines: readonly LineConfig[],
  lineTagSuccession: TagSuccessionConfig,
  options?: Record<number, LinesPageLineLintOptions>,
) {
  lines.forEach((line, index) => {
    if (options?.[line.id]?.ignoreUnlistedLine) {
      return;
    }

    const lineTags = Tags.build(line.tags, lineTagSuccession);
    const isListed = linesPage.sections.some((section) =>
      lineTags.has(section.tag),
    );

    if (!isListed) {
      issues.add({
        message: `Line "${line.name}" is not listed in any lines page section`,
        path: `lines[${index}]`,
      });
    }
  });
}
