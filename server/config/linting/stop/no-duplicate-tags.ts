import type { StopConfig } from "../../stop-config.js";
import { IssueCollector } from "../utils/issue-collector.js";

export function checkStopNoDuplicateTags(
  issues: IssueCollector,
  stop: StopConfig,
  stopIndex: number,
) {
  const seen = new Set<number>();

  stop.tags.forEach((tag, tagIndex) => {
    if (seen.has(tag)) {
      issues.add({
        message: `Tag ${tag} is duplicated in stop "${stop.name}"`,
        path: `stops[${stopIndex}].tags[${tagIndex}]`,
      });
    }
    seen.add(tag);
  });
}
