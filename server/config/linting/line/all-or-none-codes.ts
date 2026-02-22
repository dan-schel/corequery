import type { LineConfig } from "@/server/config/types/line-config.js";
import type { LineLintOptions } from "@/server/config/linting/types.js";
import { findAllOrNoneViolations } from "@/server/config/linting/utils/find-all-or-none-violations.js";
import { IssueCollector } from "@/server/config/linting/utils/issue-collector.js";

export function checkLinesAllOrNoneHaveCodes(
  issues: IssueCollector,
  lines: readonly LineConfig[],
  options: Record<number, LineLintOptions>,
) {
  const linesToCheck = lines.filter(
    (line) => !(options[line.id]?.ignoreMissingCode ?? false),
  );

  const missingCodes = findAllOrNoneViolations(
    linesToCheck,
    (line) => line.code !== null,
  );

  for (const { item: line, index } of missingCodes ?? []) {
    issues.add({
      message: `Line "${line.name}" is missing a code.`,
      path: `lines[${index}].code`,
    });
  }
}
