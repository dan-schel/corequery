import type { StopConfig } from "@/server/config/types/stop-config.js";
import { findDuplicates } from "@/server/config/linting/utils/find-duplicates.js";
import { IssueCollector } from "@/server/config/linting/utils/issue-collector.js";

export function checkStopsUniqueIds(
  issues: IssueCollector,
  stops: readonly StopConfig[],
) {
  const duplicates = findDuplicates(stops, (stop) => stop.id);

  for (const [id, indices] of duplicates) {
    for (const index of indices) {
      issues.add({
        message: `Stop ID ${id} is duplicated.`,
        path: `stops[${index}].id`,
      });
    }
  }
}
