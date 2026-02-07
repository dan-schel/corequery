import type { StopConfig } from "../../../types/stop-config.js";
import type { StopLintOptions } from "../../types.js";
import { findDuplicates } from "../../utils/find-duplicates.js";
import { IssueCollector } from "../../utils/issue-collector.js";

export function checkStopPositionsUniqueNames(
  issues: IssueCollector,
  stop: StopConfig,
  stopIndex: number,
  options?: StopLintOptions,
) {
  if (options?.ignoreDuplicatedPositionName) return;

  const duplicates = findDuplicates(
    stop.positions,
    (position) => position.name,
  );

  for (const [name, indices] of duplicates) {
    for (const index of indices) {
      issues.add({
        message: `Position name "${name}" is duplicated in stop "${stop.name}".`,
        path: `stops[${stopIndex}].positions[${index}].name`,
      });
    }
  }
}
