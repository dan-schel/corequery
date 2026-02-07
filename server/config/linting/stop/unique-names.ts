import type { StopConfig } from "../../types/stop-config.js";
import type { StopLintOptions } from "../types.js";
import { findDuplicates } from "../utils/find-duplicates.js";
import { IssueCollector } from "../utils/issue-collector.js";

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
