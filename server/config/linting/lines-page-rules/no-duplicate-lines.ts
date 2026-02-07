import type { LinesPageConfig } from "../../lines-page-config.js";
import type { LineConfig } from "../../line-config.js";
import type { LinesPageLintOptions } from "../types.js";
import { IssueCollector } from "../utils/issue-collector.js";

export function checkLinesPageNoDuplicateLines(
  issues: IssueCollector,
  linesPage: LinesPageConfig,
  lines: readonly LineConfig[],
  options?: LinesPageLintOptions,
) {
  if (options?.ignoreDuplicatedLine) {
    return;
  }
  const lineOccurrences = new Map<number, number[]>();

  // TODO: Seems unnecessary to do this in two stages.
  linesPage.sections.forEach((section, sectionIndex) => {
    lines.forEach((line) => {
      // TODO: This is not correct, because tags have succession.
      if (line.tags.includes(section.tag)) {
        const occurrences = lineOccurrences.get(line.id) || [];
        occurrences.push(sectionIndex);
        lineOccurrences.set(line.id, occurrences);
      }
    });
  });

  lineOccurrences.forEach((sectionIndices, lineId) => {
    if (sectionIndices.length > 1) {
      const line = lines.find((l) => l.id === lineId);
      if (line) {
        // TODO: Not sure about how this is formatted. We're getting error
        // for each section with the line in it?
        sectionIndices.forEach((sectionIndex) => {
          issues.add({
            message: `Line "${line.name}" appears in multiple lines page sections`,
            path: `linesPage.sections[${sectionIndex}]`,
          });
        });
      }
    }
  });
}
