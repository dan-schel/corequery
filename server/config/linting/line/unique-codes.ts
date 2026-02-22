import type { LineConfig } from "@/server/config/types/line-config.js";
import type { LineLintOptions } from "@/server/config/linting/types.js";
import { findDuplicates } from "@/server/config/linting/utils/find-duplicates.js";
import { IssueCollector } from "@/server/config/linting/utils/issue-collector.js";
import { itsOk } from "@dan-schel/js-utils";

export function checkLinesUniqueCodes(
  issues: IssueCollector,
  lines: readonly LineConfig[],
  options: Record<number, LineLintOptions>,
) {
  const linesWithCodes = lines
    .map((line, lineIndex) => ({ line, lineIndex }))
    .filter(({ line }) => line.code !== null);

  const duplicates = findDuplicates(linesWithCodes, ({ line }) =>
    itsOk(line.code),
  );

  for (const [code, indices] of duplicates) {
    for (const index of indices) {
      const { line, lineIndex } = itsOk(linesWithCodes[index]);
      if (options[line.id]?.ignoreDuplicatedCode ?? false) continue;

      issues.add({
        message: `Line code "${code}" is duplicated.`,
        path: `lines[${lineIndex}].code`,
      });
    }
  }
}
