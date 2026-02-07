import type { LineConfig } from "../../line-config.js";
import type { LineLintOptions } from "../types.js";
import { findAllOrNoneViolations } from "../utils/helpers.js";
import { IssueCollector } from "../utils/issue-collector.js";

export function checkLinesAllOrNoneHaveCodes(
  issues: IssueCollector,
  lines: readonly LineConfig[],
  options?: Record<number, LineLintOptions>,
) {
  const linesToCheck = lines.filter(
    (line) => !options?.[line.id]?.ignoreMissingCode,
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
