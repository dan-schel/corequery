import type { StopConfig } from "@/server/config/types/stop-config.js";
import { IssueCollector } from "@/server/config/linting/utils/issue-collector.js";

export function checkStopNonEmptyName(
  issues: IssueCollector,
  stop: StopConfig,
  stopIndex: number,
) {
  if (stop.name.length === 0) {
    issues.add({
      message: "Stop name is empty.",
      path: `stops[${stopIndex}].name`,
    });
  }
}
