import type { StopConfig } from "../../stop-config.js";
import { IssueCollector } from "../utils/issue-collector.js";

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
