import type { CorequeryConfig } from "../config.js";
import type { LintIssue, LintOptions } from "./types.js";
import { IssueCollector } from "./utils/issue-collector.js";
import { checkStopsUniqueIds } from "./stop/unique-ids.js";
import { checkStopsUniqueNames } from "./stop/unique-names.js";
import { checkStopsAllOrNoneHaveLocations } from "./stop/all-or-none-locations.js";
import { checkStopsAllOrNoneHavePositions } from "./stop/all-or-none-positions.js";
import { checkStopsAppearInRoutes } from "./stop/appears-in-routes.js";
import { checkStopPositionsUniqueIds } from "./stop/position/position-unique-ids.js";
import { checkStopPositionsUniqueNames } from "./stop/position/position-unique-names.js";
import { checkStopNoDuplicateTags } from "./stop/no-duplicate-tags.js";
import { checkLinesUniqueIds } from "./line/unique-ids.js";
import { checkLinesUniqueNames } from "./line/unique-names.js";
import { checkLinesAllOrNoneHaveCodes } from "./line/all-or-none-codes.js";
import { checkLineHasRoutes } from "./line/has-routes.js";
import { checkLineRoutesUniqueIds } from "./line/route/route-unique-ids.js";
import { checkLineRoutesUniqueNames } from "./line/route/route-unique-names.js";
import { checkLineRoutesMirrored } from "./line/route/routes-mirrored.js";
import { checkLineNoDuplicateTags } from "./line/no-duplicate-tags.js";
import { checkRouteHasMinimumStops } from "./line/route/route-minimum-stops.js";
import { checkRouteNoDuplicateTags } from "./line/route/route-no-duplicate-tags.js";
import { checkRouteStopsExist } from "./line/route/route-stops-exist.js";
import { checkLineDiagramHasEntries } from "./line/diagram/diagram-has-entries.js";
import { checkLineDiagramEntriesMinimumStops } from "./line/diagram/diagram-entry-minimum-stops.js";
import { checkLineDiagramStopsExist } from "./line/diagram/diagram-stops-exist.js";
import { checkLineDiagramStopsInRoutes } from "./line/diagram/diagram-stops-in-routes.js";
import { checkLinesPageAllLinesListed } from "./lines-page/all-lines-listed.js";
import { checkLinesPageNoDuplicateLines } from "./lines-page/no-duplicate-lines.js";
import { checkTagsNoDuplicatesInSuccession } from "./tags/no-duplicates-in-succession.js";

export function lintConfig(
  config: CorequeryConfig,
  options?: LintOptions,
): LintIssue[] {
  const issues = new IssueCollector();

  checkStopsUniqueIds(issues, config.stops);
  checkStopsUniqueNames(issues, config.stops, options?.stops);
  checkStopsAllOrNoneHaveLocations(issues, config.stops, options?.stops);
  checkStopsAllOrNoneHavePositions(issues, config.stops, options?.stops);
  checkStopsAppearInRoutes(issues, config.stops, config.lines, options?.stops);

  config.stops.forEach((stop, index) => {
    checkStopPositionsUniqueIds(issues, stop, index);
    checkStopPositionsUniqueNames(
      issues,
      stop,
      index,
      options?.stops?.[stop.id],
    );
    checkStopNoDuplicateTags(issues, stop, index);
  });

  checkLinesUniqueIds(issues, config.lines);
  checkLinesUniqueNames(issues, config.lines, options?.lines);
  checkLinesAllOrNoneHaveCodes(issues, config.lines, options?.lines);

  config.lines.forEach((line, lineIndex) => {
    checkLineHasRoutes(issues, line, lineIndex, options?.lines?.[line.id]);
    checkLineRoutesUniqueIds(issues, line, lineIndex);
    checkLineRoutesUniqueNames(
      issues,
      line,
      lineIndex,
      options?.lines?.[line.id],
    );
    checkLineRoutesMirrored(issues, line, lineIndex, options?.lines?.[line.id]);
    checkLineNoDuplicateTags(issues, line, lineIndex);

    line.routes.forEach((route, routeIndex) => {
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
    });

    checkLineDiagramHasEntries(
      issues,
      line,
      lineIndex,
      options?.lines?.[line.id],
    );
    checkLineDiagramEntriesMinimumStops(issues, line, lineIndex);
    checkLineDiagramStopsExist(issues, line, lineIndex, config.stops);
    checkLineDiagramStopsInRoutes(
      issues,
      line,
      lineIndex,
      options?.lines?.[line.id],
    );
  });

  checkLinesPageAllLinesListed(
    issues,
    config.linesPage,
    config.lines,
    config.tags.lineTagSuccession,
    options?.linesPage,
  );
  checkLinesPageNoDuplicateLines(
    issues,
    config.linesPage,
    config.lines,
    config.tags.lineTagSuccession,
    options?.linesPage,
  );

  checkTagsNoDuplicatesInSuccession(issues, config.tags);

  return issues.getIssues();
}
