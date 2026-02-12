import type { StopConfig } from "@/server/config/types/stop-config.js";
import type { StopLintOptions } from "@/server/config/linting/types.js";
import { findDuplicates } from "@/server/config/linting/utils/find-duplicates.js";
import { IssueCollector } from "@/server/config/linting/utils/issue-collector.js";

export function checkStopsUniqueNames(
  issues: IssueCollector,
  stops: readonly StopConfig[],
  options?: Record<number, StopLintOptions>,
) {
  const duplicates = findDuplicates(stops, (stop) => stop.name);

  for (const [name, indices] of duplicates) {
    for (const index of indices) {
      const stop = stops[index];
      if (!stop || options?.[stop.id]?.ignoreDuplicatedName) continue;

      issues.add({
        message: `Stop name "${name}" is duplicated.`,
        path: `stops[${index}].name`,
      });
    }
  }
}
