import type { LinesPageConfig } from "@/server/config/types/lines-page-config.js";
import type { LineConfig } from "@/server/config/types/line-config.js";
import type { TagSuccessionConfig } from "@/server/config/types/tags-config.js";
import { Tags } from "@/server/data/tags.js";
import type { LinesPageLineLintOptions } from "@/server/config/linting/types.js";
import { IssueCollector } from "@/server/config/linting/utils/issue-collector.js";

export function checkLinesPageAllLinesListed(
  issues: IssueCollector,
  linesPage: LinesPageConfig,
  lines: readonly LineConfig[],
  lineTagSuccession: TagSuccessionConfig,
  options?: Record<number, LinesPageLineLintOptions>,
) {
  for (const [index, line] of lines.entries()) {
    if (options?.[line.id]?.ignoreUnlistedLine ?? false) continue;

    const lineTags = Tags.build(line.tags, lineTagSuccession);
    const isListed = linesPage.sections.some((section) =>
      lineTags.has(section.tag),
    );

    if (!isListed) {
      issues.add({
        message: `Line "${line.name}" is not listed in any lines page section.`,
        path: `lines[${index}]`,
      });
    }
  }
}
