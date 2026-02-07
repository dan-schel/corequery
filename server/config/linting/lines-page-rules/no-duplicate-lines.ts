import type { LinesPageConfig } from "../../lines-page-config.js";
import type { LineConfig } from "../../line-config.js";
import type { LintIssue, LinesPageLintOptions } from "../types.js";
import { createIssue } from "../utils/helpers.js";

export function checkLinesPageNoDuplicateLines(
  linesPage: LinesPageConfig,
  lines: readonly LineConfig[],
  options?: LinesPageLintOptions,
): LintIssue[] {
  if (options?.ignoreDuplicatedLine) {
    return [];
  }

  const issues: LintIssue[] = [];
  const lineOccurrences = new Map<number, number[]>();

  linesPage.sections.forEach((section, sectionIndex) => {
    lines.forEach((line) => {
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
        sectionIndices.forEach((sectionIndex) => {
          issues.push(
            createIssue(
              `Line "${line.name}" appears in multiple lines page sections`,
              `linesPage.sections[${sectionIndex}]`,
            ),
          );
        });
      }
    }
  });

  return issues;
}
