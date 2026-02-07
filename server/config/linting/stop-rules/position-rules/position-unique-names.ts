import type { StopConfig } from "../../../stop-config.js";
import type { LintIssue } from "../../types.js";
import { createIssue, findDuplicates } from "../../utils/helpers.js";

export function checkStopPositionsUniqueNames(
  stop: StopConfig,
  stopIndex: number,
): LintIssue[] {
  const issues: LintIssue[] = [];
  const duplicates = findDuplicates(
    stop.positions,
    (position) => position.name,
  );

  duplicates.forEach((indices, name) => {
    indices.forEach((index) => {
      issues.push(
        createIssue(
          `Position name "${name}" is duplicated in stop "${stop.name}"`,
          `stops[${stopIndex}].positions[${index}].name`,
        ),
      );
    });
  });

  return issues;
}
