import type { StopConfig } from "../../types/stop-config.js";
import { findDuplicates } from "../utils/find-duplicates.js";
import { IssueCollector } from "../utils/issue-collector.js";

export function checkStopNoDuplicateTags(
  issues: IssueCollector,
  stop: StopConfig,
  stopIndex: number,
) {
  const duplicates = findDuplicates(stop.tags, (tag) => tag);

  for (const [tag, indices] of duplicates) {
    for (const index of indices) {
      issues.add({
        message: `Tag ${tag} is duplicated in stop "${stop.name}".`,
        path: `stops[${stopIndex}].tags[${index}]`,
      });
    }
  }
}
