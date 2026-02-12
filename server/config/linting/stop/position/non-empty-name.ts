import type { PositionConfig } from "@/server/config/types/stop-config.js";
import { IssueCollector } from "@/server/config/linting/utils/issue-collector.js";

export function checkStopPositionNonEmptyName(
  issues: IssueCollector,
  position: PositionConfig,
  positionIndex: number,
  stopIndex: number,
) {
  if (position.name.length === 0) {
    issues.add({
      message: `Position name is empty.`,
      path: `stops[${stopIndex}].positions[${positionIndex}].name`,
    });
  }
}
