import type { StopConfig } from "../../stop-config.js";
import type { LintIssue } from "../types.js";
import { createIssue, findDuplicates } from "../utils/helpers.js";

export function checkStopPositionsUniqueIds(
  stop: StopConfig,
  stopIndex: number,
): LintIssue[] {
  const issues: LintIssue[] = [];
  const duplicates = findDuplicates(
    stop.positions,
    (position) => position.stopPositionId,
  );

  duplicates.forEach((indices, id) => {
    indices.forEach((index) => {
      issues.push(
        createIssue(
          `Position ID ${id} is duplicated in stop "${stop.name}"`,
          `stops[${stopIndex}].positions[${index}].stopPositionId`,
        ),
      );
    });
  });

  return issues;
}
