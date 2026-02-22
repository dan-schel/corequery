import type { LinesPageConfig } from "@/server/config/types/lines-page-config.js";
import type { LineConfig } from "@/server/config/types/line-config.js";
import type { TagSuccessionConfig } from "@/server/config/types/tags-config.js";
import { Tags } from "@/server/data/tags.js";
import type { LinesPageLineLintOptions } from "@/server/config/linting/types.js";
import { IssueCollector } from "@/server/config/linting/utils/issue-collector.js";

export function checkLinesPageNoDuplicateLines(
  issues: IssueCollector,
  linesPage: LinesPageConfig,
  lines: readonly LineConfig[],
  lineTagSuccession: TagSuccessionConfig,
  options: Record<number, LinesPageLineLintOptions>,
) {
  for (const line of lines) {
    if (options[line.id]?.ignoreDuplicatedLine ?? false) continue;

    const lineTags = Tags.build(line.tags, lineTagSuccession);
    const sectionNames = linesPage.sections
      .filter((section) => lineTags.has(section.tag))
      .map((section) => section.name);

    if (sectionNames.length > 1) {
      issues.add({
        message: `Line "${line.name}" appears in multiple lines page sections: ${sectionNames.join(", ")}.`,
        path: "linesPage.sections",
      });
    }
  }
}
