import type { StopConfig } from "../../../stop-config.js";
import type { StopLintOptions } from "../../types.js";
import { findDuplicates } from "../../utils/find-duplicates.js";
import { IssueCollector } from "../../utils/issue-collector.js";

export function checkStopPositionsUniqueNames(
  issues: IssueCollector,
  stop: StopConfig,
  stopIndex: number,
  options?: StopLintOptions,
) {
  if (options?.ignoreDuplicatedPositionName) {
    return;
  }

  const duplicates = findDuplicates(
    stop.positions,
    (position) => position.name,
  );

  duplicates.forEach((indices, name) => {
    indices.forEach((index) => {
      issues.add({
        message: `Position name "${name}" is duplicated in stop "${stop.name}".`,
        path: `stops[${stopIndex}].positions[${index}].name`,
      });
    });
  });
}
