import type { StopConfig } from "@/server/config/types/stop-config.js";
import type { StopLintOptions } from "@/server/config/linting/types.js";
import { findDuplicates } from "@/server/config/linting/utils/find-duplicates.js";
import { IssueCollector } from "@/server/config/linting/utils/issue-collector.js";

export function checkStopPositionsUniqueNames(
  issues: IssueCollector,
  stop: StopConfig,
  stopIndex: number,
  options?: StopLintOptions,
) {
  if (options?.ignoreDuplicatedPositionName ?? false) return;

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
