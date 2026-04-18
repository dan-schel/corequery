import type { LineConfig } from "@/server/config/types/line-config.js";
import type { StopConfig } from "@/server/config/types/stop-config.js";
import type { LineLintOptions } from "@/server/config/linting/types.js";
import type { IssueCollector } from "@/server/config/linting/utils/issue-collector.js";
import { checkRouteHasMinimumStops } from "@/server/config/linting/line/route/minimum-stops.js";
import { checkRouteNoDuplicateTags } from "@/server/config/linting/line/route/no-duplicate-tags.js";
import { checkLineRouteNonEmptyName } from "@/server/config/linting/line/route/non-empty-name.js";
import { checkLineRoutesMirrored } from "@/server/config/linting/line/route/routes-mirrored.js";
import { checkRouteStopsExist } from "@/server/config/linting/line/route/stops-exist.js";
import { checkLineRoutesUniqueIds } from "@/server/config/linting/line/route/unique-ids.js";
import { checkLineRoutesUniqueNames } from "@/server/config/linting/line/route/unique-names.js";

export function lintLineRouteConfig(
  issues: IssueCollector,
  line: LineConfig,
  lineIndex: number,
  stops: readonly StopConfig[],
  options: LineLintOptions,
) {
  checkLineRoutesUniqueIds(issues, line, lineIndex);
  checkLineRoutesUniqueNames(issues, line, lineIndex, options);
  checkLineRoutesMirrored(issues, line, lineIndex, options);

  for (const [routeIndex, route] of line.routes.entries()) {
    checkRouteHasMinimumStops(issues, route, routeIndex, lineIndex, line.name);
    checkRouteNoDuplicateTags(issues, route, routeIndex, lineIndex, line.name);
    checkRouteStopsExist(
      issues,
      route,
      routeIndex,
      lineIndex,
      line.name,
      stops,
    );
    checkLineRouteNonEmptyName(issues, route, routeIndex, lineIndex);
  }
}
