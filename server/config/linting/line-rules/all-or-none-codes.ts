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
    lines.forEach((line, index) => {
      if (line.code === null && !options?.[line.id]?.ignoreMissingCode) {
        issues.push(
          createIssue(
            `Line "${line.name}" is missing a code (all lines should have codes or none should)`,
            `lines[${index}].code`,
          ),
        );
      }
    });
  }

  return issues;
}
