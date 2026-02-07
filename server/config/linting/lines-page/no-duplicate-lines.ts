import type { LinesPageConfig } from "../../lines-page-config.js";
import type { LineConfig } from "../../line-config.js";
import type { TagSuccessionConfig } from "../../tags-config.js";
import { Tags } from "../../../data/tags.js";
import type { LinesPageLintOptions } from "../types.js";
import { IssueCollector } from "../utils/issue-collector.js";

export function checkLinesPageNoDuplicateLines(
  issues: IssueCollector,
  linesPage: LinesPageConfig,
  lines: readonly LineConfig[],
  lineTagSuccession: TagSuccessionConfig,
  options?: LinesPageLintOptions,
) {
  if (options?.ignoreDuplicatedLine) {
    return;
  }

  lines.forEach((line) => {
    const lineTags = Tags.build(line.tags, lineTagSuccession);
    const sectionNames = linesPage.sections
      .filter((section) => lineTags.has(section.tag))
      .map((section) => section.name);

    if (sectionNames.length > 1) {
      issues.add({
        message: `Line "${line.name}" appears in multiple lines page sections: ${sectionNames.join(", ")}`,
        path: "linesPage.sections",
      });
    }
  });
}
