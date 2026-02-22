import type { LineConfig } from "@/server/config/types/line-config.js";
import type { StopConfig } from "@/server/config/types/stop-config.js";
import type { StopLintOptions } from "@/server/config/linting/types.js";
import type { IssueCollector } from "@/server/config/linting/utils/issue-collector.js";
import { checkStopsAllOrNoneHaveLocations } from "@/server/config/linting/stop/all-or-none-locations.js";
import { checkStopsAllOrNoneHavePositions } from "@/server/config/linting/stop/all-or-none-positions.js";
import { checkStopsAppearInRoutes } from "@/server/config/linting/stop/appears-in-routes.js";
import { checkStopNoDuplicateTags } from "@/server/config/linting/stop/no-duplicate-tags.js";
import { checkStopNonEmptyName } from "@/server/config/linting/stop/non-empty-name.js";
import { lintStopPositionConfig } from "@/server/config/linting/stop/position/index.js";
import { checkStopsUniqueIds } from "@/server/config/linting/stop/unique-ids.js";
import { checkStopsUniqueUrlPaths } from "@/server/config/linting/stop/unique-url-paths.js";
import { checkStopsUniqueNames } from "@/server/config/linting/stop/unique-names.js";

export function lintStopConfig(
  issues: IssueCollector,
  stops: readonly StopConfig[],
  lines: readonly LineConfig[],
  options: Record<number, StopLintOptions>,
): void {
  checkStopsUniqueIds(issues, stops);
  checkStopsUniqueUrlPaths(issues, stops);
  checkStopsUniqueNames(issues, stops, options);
  checkStopsAllOrNoneHaveLocations(issues, stops, options);
  checkStopsAllOrNoneHavePositions(issues, stops, options);
  checkStopsAppearInRoutes(issues, stops, lines, options);

  for (const [stopIndex, stop] of stops.entries()) {
    checkStopNonEmptyName(issues, stop, stopIndex);
    checkStopNoDuplicateTags(issues, stop, stopIndex);

    lintStopPositionConfig(issues, stop, stopIndex, options[stop.id] ?? {});
  }
}
