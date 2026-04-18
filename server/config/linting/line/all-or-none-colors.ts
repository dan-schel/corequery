import type { LineConfig } from "@/server/config/types/line-config.js";
import type { LineLintOptions } from "@/server/config/linting/types.js";
import { findAllOrNoneViolations } from "@/server/config/linting/utils/find-all-or-none-violations.js";
import { IssueCollector } from "@/server/config/linting/utils/issue-collector.js";

export function checkLinesAllOrNoneHaveColors(
  issues: IssueCollector,
  lines: readonly LineConfig[],
  options: Record<number, LineLintOptions>,
) {
  const linesToCheck = lines.filter(
    (line) => !(options[line.id]?.ignoreMissingColor ?? false),
  );

  const missingColors = findAllOrNoneViolations(
    linesToCheck,
    (line) => line.color !== null,
  );

  for (const { item: line, index } of missingColors ?? []) {
    issues.add({
      message: `Line "${line.name}" is missing a color.`,
      path: `lines[${index}].color`,
    });
  }
}
