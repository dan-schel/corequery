import type { StopConfig } from "@/server/config/types/stop-config.js";
import { findDuplicates } from "@/server/config/linting/utils/find-duplicates.js";
import { IssueCollector } from "@/server/config/linting/utils/issue-collector.js";

export function checkStopsUniqueUrlPaths(
  issues: IssueCollector,
  stops: readonly StopConfig[],
) {
  const duplicates = findDuplicates(stops, (stop) => stop.urlPath);

  for (const [urlPath, indices] of duplicates) {
    for (const index of indices) {
      issues.add({
        message: `Stop URL path "${urlPath}" is duplicated.`,
        path: `stops[${index}].urlPath`,
      });
    }
  }
}
