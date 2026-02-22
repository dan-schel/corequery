import type { StopConfig } from "@/server/config/types/stop-config.js";
import type { StopLintOptions } from "@/server/config/linting/types.js";
import type { IssueCollector } from "@/server/config/linting/utils/issue-collector.js";
import { checkStopPositionNonEmptyName } from "@/server/config/linting/stop/position/non-empty-name.js";
import { checkStopPositionsUniqueIds } from "@/server/config/linting/stop/position/unique-ids.js";
import { checkStopPositionsUniqueNames } from "@/server/config/linting/stop/position/unique-names.js";

export function lintStopPositionConfig(
  issues: IssueCollector,
  stop: StopConfig,
  stopIndex: number,
  options: StopLintOptions,
): void {
  checkStopPositionsUniqueIds(issues, stop, stopIndex);
  checkStopPositionsUniqueNames(issues, stop, stopIndex, options);

  for (const [positionIndex, position] of stop.positions.entries()) {
    checkStopPositionNonEmptyName(issues, position, positionIndex, stopIndex);
  }
}
