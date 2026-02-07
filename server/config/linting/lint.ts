import type { CorequeryConfig } from "../config.js";
import type { LintIssue, LintOptions } from "./types.js";
import { IssueCollector } from "./utils/issue-collector.js";
import { checkStopsUniqueIds } from "./stop-rules/unique-ids.js";
import { checkStopsUniqueNames } from "./stop-rules/unique-names.js";
import { checkStopsAllOrNoneHaveLocations } from "./stop-rules/all-or-none-locations.js";
import { checkStopsAllOrNoneHavePositions } from "./stop-rules/all-or-none-positions.js";
import { checkStopsAppearInRoutes } from "./stop-rules/appears-in-routes.js";
import { checkStopPositionsUniqueIds } from "./stop-rules/position-rules/position-unique-ids.js";
import { checkStopPositionsUniqueNames } from "./stop-rules/position-rules/position-unique-names.js";
import { checkStopNoDuplicateTags } from "./stop-rules/no-duplicate-tags.js";
import { checkLinesUniqueIds } from "./line-rules/unique-ids.js";
import { checkLinesUniqueNames } from "./line-rules/unique-names.js";
import { checkLinesAllOrNoneHaveCodes } from "./line-rules/all-or-none-codes.js";
import { checkLineHasRoutes } from "./line-rules/has-routes.js";
import { checkLineRoutesUniqueIds } from "./line-rules/route-rules/route-unique-ids.js";
import { checkLineRoutesUniqueNames } from "./line-rules/route-rules/route-unique-names.js";
import { checkLineRoutesMirrored } from "./line-rules/route-rules/routes-mirrored.js";
import { checkLineNoDuplicateTags } from "./line-rules/no-duplicate-tags.js";
import { checkRouteHasMinimumStops } from "./line-rules/route-rules/route-minimum-stops.js";
import { checkRouteNoDuplicateTags } from "./line-rules/route-rules/route-no-duplicate-tags.js";
import { checkRouteStopsExist } from "./line-rules/route-rules/route-stops-exist.js";
import { checkLineDiagramHasEntries } from "./line-rules/diagram-rules/diagram-has-entries.js";
import { checkLineDiagramEntriesMinimumStops } from "./line-rules/diagram-rules/diagram-entry-minimum-stops.js";
import { checkLineDiagramStopsExist } from "./line-rules/diagram-rules/diagram-stops-exist.js";
import { checkLineDiagramStopsInRoutes } from "./line-rules/diagram-rules/diagram-stops-in-routes.js";
import { checkLinesPageAllLinesListed } from "./lines-page-rules/all-lines-listed.js";
import { checkLinesPageNoDuplicateLines } from "./lines-page-rules/no-duplicate-lines.js";
import { checkTagsNoDuplicatesInSuccession } from "./tags-rules/no-duplicates-in-succession.js";

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
    checkStopPositionsUniqueNames(issues, stop, index);
    checkStopNoDuplicateTags(issues, stop, index);
  });

  checkLinesUniqueIds(issues, config.lines);
  checkLinesUniqueNames(issues, config.lines, options?.lines);
  checkLinesAllOrNoneHaveCodes(issues, config.lines, options?.lines);

  config.lines.forEach((line, lineIndex) => {
    checkLineHasRoutes(issues, line, lineIndex);
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

    checkLineDiagramHasEntries(issues, line, lineIndex);
    checkLineDiagramEntriesMinimumStops(issues, line, lineIndex);
    checkLineDiagramStopsExist(issues, line, lineIndex, config.stops);
    checkLineDiagramStopsInRoutes(issues, line, lineIndex);
  });

  checkLinesPageAllLinesListed(
    issues,
    config.linesPage,
    config.lines,
    options?.linesPage,
  );
  checkLinesPageNoDuplicateLines(
    issues,
    config.linesPage,
    config.lines,
    options?.linesPage,
  );

  checkTagsNoDuplicatesInSuccession(issues, config.tags);

  return issues.getIssues();
}
