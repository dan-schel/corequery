import type { StopConfig } from "../../stop-config.js";
import { findDuplicates } from "../utils/find-duplicates.js";
import { IssueCollector } from "../utils/issue-collector.js";

export function checkStopNoDuplicateTags(
  issues: IssueCollector,
  stop: StopConfig,
  stopIndex: number,
) {
  const duplicates = findDuplicates(stop.tags, (tag) => tag);

  duplicates.forEach((indices, tag) => {
    indices.forEach((index) => {
      issues.add({
        message: `Tag ${tag} is duplicated in stop "${stop.name}".`,
        path: `stops[${stopIndex}].tags[${index}]`,
      });
    });
  });
}
