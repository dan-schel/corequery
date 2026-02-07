import type { CorequeryConfig } from "../config.js";
import type { LintIssue, LintOptions } from "./types.js";
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
  const issues: LintIssue[] = [];

  issues.push(...checkStopsUniqueIds(config.stops));
  issues.push(...checkStopsUniqueNames(config.stops, options?.stops));
  issues.push(
    ...checkStopsAllOrNoneHaveLocations(config.stops, options?.stops),
  );
  issues.push(
    ...checkStopsAllOrNoneHavePositions(config.stops, options?.stops),
  );
  issues.push(
    ...checkStopsAppearInRoutes(config.stops, config.lines, options?.stops),
  );

  config.stops.forEach((stop, index) => {
    issues.push(...checkStopPositionsUniqueIds(stop, index));
    issues.push(...checkStopPositionsUniqueNames(stop, index));
    issues.push(...checkStopNoDuplicateTags(stop, index));
  });

  issues.push(...checkLinesUniqueIds(config.lines));
  issues.push(...checkLinesUniqueNames(config.lines, options?.lines));
  issues.push(...checkLinesAllOrNoneHaveCodes(config.lines, options?.lines));

  config.lines.forEach((line, lineIndex) => {
    issues.push(...checkLineHasRoutes(line, lineIndex));
    issues.push(...checkLineRoutesUniqueIds(line, lineIndex));
    issues.push(
      ...checkLineRoutesUniqueNames(line, lineIndex, options?.lines?.[line.id]),
    );
    issues.push(
      ...checkLineRoutesMirrored(line, lineIndex, options?.lines?.[line.id]),
    );
    issues.push(...checkLineNoDuplicateTags(line, lineIndex));

    line.routes.forEach((route, routeIndex) => {
      issues.push(
        ...checkRouteHasMinimumStops(route, routeIndex, lineIndex, line.name),
      );
      issues.push(
        ...checkRouteNoDuplicateTags(route, routeIndex, lineIndex, line.name),
      );
      issues.push(
        ...checkRouteStopsExist(
          route,
          routeIndex,
          lineIndex,
          line.name,
          config.stops,
        ),
      );
    });

    issues.push(...checkLineDiagramHasEntries(line, lineIndex));
    issues.push(...checkLineDiagramEntriesMinimumStops(line, lineIndex));
    issues.push(...checkLineDiagramStopsExist(line, lineIndex, config.stops));
    issues.push(...checkLineDiagramStopsInRoutes(line, lineIndex));
  });

  issues.push(
    ...checkLinesPageAllLinesListed(
      config.linesPage,
      config.lines,
      options?.linesPage,
    ),
  );
  issues.push(
    ...checkLinesPageNoDuplicateLines(
      config.linesPage,
      config.lines,
      options?.linesPage,
    ),
  );

  issues.push(...checkTagsNoDuplicatesInSuccession(config.tags));

  return issues;
}
