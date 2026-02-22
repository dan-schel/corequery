import type { StopConfig } from "@/server/config/types/stop-config.js";
import { IssueCollector } from "@/server/config/linting/utils/issue-collector.js";

export function checkStopNonEmptyUrlPath(
  issues: IssueCollector,
  stop: StopConfig,
  stopIndex: number,
) {
  if (stop.urlPath.length === 0) {
    issues.add({
      message: "Stop URL path is empty.",
      path: `stops[${stopIndex}].urlPath`,
    });
  }
}
