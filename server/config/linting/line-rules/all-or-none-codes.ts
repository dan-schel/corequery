import type { LineConfig } from "../../line-config.js";
import type { LintIssue, LineLintOptions } from "../types.js";
import { createIssue, allOrNone } from "../utils/helpers.js";

export function checkLinesAllOrNoneHaveCodes(
  lines: readonly LineConfig[],
  options?: Record<number, LineLintOptions>,
): LintIssue[] {
  const issues: LintIssue[] = [];

  const linesToCheck = lines.filter(
    (line) => !options?.[line.id]?.ignoreMissingCode,
  );

  const status = allOrNone(linesToCheck, (line) => line.code !== null);

  if (status === "mixed") {
    linesToCheck.forEach((line, index) => {
      if (line.code === null) {
        issues.push(
          createIssue(
            `Line "${line.name}" is missing a code.`,
            `lines[${index}].code`,
          ),
        );
      }
    });
  }

  return issues;
}
