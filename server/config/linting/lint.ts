import type {
  LintableConfig,
  LintIssue,
  LintOptions,
} from "@/server/config/linting/types.js";
import { IssueCollector } from "@/server/config/linting/utils/issue-collector.js";
import { checkStopsUniqueIds } from "@/server/config/linting/stop/unique-ids.js";
import { checkStopsUniqueNames } from "@/server/config/linting/stop/unique-names.js";
import { checkStopNonEmptyName } from "@/server/config/linting/stop/non-empty-name.js";
import { checkStopsAllOrNoneHaveLocations } from "@/server/config/linting/stop/all-or-none-locations.js";
import { checkStopsAllOrNoneHavePositions } from "@/server/config/linting/stop/all-or-none-positions.js";
import { checkStopsAppearInRoutes } from "@/server/config/linting/stop/appears-in-routes.js";
import { checkStopPositionsUniqueIds } from "@/server/config/linting/stop/position/unique-ids.js";
import { checkStopPositionsUniqueNames } from "@/server/config/linting/stop/position/unique-names.js";
import { checkStopPositionNonEmptyName } from "@/server/config/linting/stop/position/non-empty-name.js";
import { checkStopNoDuplicateTags } from "@/server/config/linting/stop/no-duplicate-tags.js";
import { checkLinesUniqueIds } from "@/server/config/linting/line/unique-ids.js";
import { checkLinesUniqueNames } from "@/server/config/linting/line/unique-names.js";
import { checkLineNonEmptyName } from "@/server/config/linting/line/non-empty-name.js";
import { checkLinesAllOrNoneHaveCodes } from "@/server/config/linting/line/all-or-none-codes.js";
import { checkLineHasRoutes } from "@/server/config/linting/line/has-routes.js";
import { checkLineRoutesUniqueIds } from "@/server/config/linting/line/route/unique-ids.js";
import { checkLineRoutesUniqueNames } from "@/server/config/linting/line/route/unique-names.js";
import { checkLineRouteNonEmptyName } from "@/server/config/linting/line/route/non-empty-name.js";
import { checkLineRoutesMirrored } from "@/server/config/linting/line/route/routes-mirrored.js";
import { checkLineNoDuplicateTags } from "@/server/config/linting/line/no-duplicate-tags.js";
import { checkRouteHasMinimumStops } from "@/server/config/linting/line/route/minimum-stops.js";
import { checkRouteNoDuplicateTags } from "@/server/config/linting/line/route/no-duplicate-tags.js";
import { checkRouteStopsExist } from "@/server/config/linting/line/route/stops-exist.js";
import { checkLinesPageAllLinesListed } from "@/server/config/linting/lines-page/all-lines-listed.js";
import { checkLinesPageNoDuplicateLines } from "@/server/config/linting/lines-page/no-duplicate-lines.js";
import { checkTagsNoDuplicatesInSuccession } from "@/server/config/linting/tags/no-duplicates-in-succession.js";
import { lintLineDiagramConfig } from "@/server/config/linting/line/diagram/index.js";

export function lintConfig(
  config: LintableConfig,
  options?: LintOptions,
): LintIssue[] {
  const issues = new IssueCollector();

  checkStopsUniqueIds(issues, config.stops);
  checkStopsUniqueNames(issues, config.stops, options?.stops ?? {});
  checkStopsAllOrNoneHaveLocations(issues, config.stops, options?.stops ?? {});
  checkStopsAllOrNoneHavePositions(issues, config.stops, options?.stops ?? {});
  checkStopsAppearInRoutes(
    issues,
    config.stops,
    config.lines,
    options?.stops ?? {},
  );

  for (const [stopIndex, stop] of config.stops.entries()) {
    checkStopPositionsUniqueIds(issues, stop, stopIndex);
    checkStopNonEmptyName(issues, stop, stopIndex);
    checkStopPositionsUniqueNames(
      issues,
      stop,
      stopIndex,
      options?.stops?.[stop.id] ?? {},
    );
    checkStopNoDuplicateTags(issues, stop, stopIndex);

    for (const [positionIndex, position] of stop.positions.entries()) {
      checkStopPositionNonEmptyName(issues, position, positionIndex, stopIndex);
    }
  }

  checkLinesUniqueIds(issues, config.lines);
  checkLinesUniqueNames(issues, config.lines, options?.lines ?? {});
  checkLinesAllOrNoneHaveCodes(issues, config.lines, options?.lines ?? {});

  for (const [lineIndex, line] of config.lines.entries()) {
    checkLineHasRoutes(
      issues,
      line,
      lineIndex,
      options?.lines?.[line.id] ?? {},
    );
    checkLineRoutesUniqueIds(issues, line, lineIndex);
    checkLineNonEmptyName(issues, line, lineIndex);
    checkLineRoutesUniqueNames(
      issues,
      line,
      lineIndex,
      options?.lines?.[line.id] ?? {},
    );
    checkLineRoutesMirrored(
      issues,
      line,
      lineIndex,
      options?.lines?.[line.id] ?? {},
    );
    checkLineNoDuplicateTags(issues, line, lineIndex);

    for (const [routeIndex, route] of line.routes.entries()) {
      checkRouteHasMinimumStops(
        issues,
        route,
        routeIndex,
        lineIndex,
        line.name,
      );
      checkRouteNoDuplicateTags(
        issues,
        route,
        routeIndex,
        lineIndex,
        line.name,
      );
      checkRouteStopsExist(
        issues,
        route,
        routeIndex,
        lineIndex,
        line.name,
        config.stops,
      );
      checkLineRouteNonEmptyName(issues, route, routeIndex, lineIndex);
    }

    lintLineDiagramConfig(
      issues,
      line,
      lineIndex,
      config.stops,
      options?.lines?.[line.id] ?? {},
    );
  }

  checkLinesPageAllLinesListed(
    issues,
    config.linesPage,
    config.lines,
    config.tags.lineTagSuccession,
    options?.linesPage ?? {},
  );
  checkLinesPageNoDuplicateLines(
    issues,
    config.linesPage,
    config.lines,
    config.tags.lineTagSuccession,
    options?.linesPage ?? {},
  );

  checkTagsNoDuplicatesInSuccession(issues, config.tags);

  return issues.getIssues();
}
