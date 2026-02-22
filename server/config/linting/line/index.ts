import type { LineConfig } from "@/server/config/types/line-config.js";
import type { LineLintOptions } from "@/server/config/linting/types.js";
import type { IssueCollector } from "@/server/config/linting/utils/issue-collector.js";
import { checkLinesAllOrNoneHaveCodes } from "@/server/config/linting/line/all-or-none-codes.js";
import { lintLineDiagramConfig } from "@/server/config/linting/line/diagram/index.js";
import { checkLineHasRoutes } from "@/server/config/linting/line/has-routes.js";
import { checkLineNoDuplicateTags } from "@/server/config/linting/line/no-duplicate-tags.js";
import { checkLineNonEmptyName } from "@/server/config/linting/line/non-empty-name.js";
import { lintLineRouteConfig } from "@/server/config/linting/line/route/index.js";
import { checkLinesUniqueIds } from "@/server/config/linting/line/unique-ids.js";
import { checkLinesUniqueUrlPaths } from "@/server/config/linting/line/unique-url-paths.js";
import { checkLinesUniqueNames } from "@/server/config/linting/line/unique-names.js";
import type { StopConfig } from "@/server/config/types/stop-config.js";

export function lintLineConfig(
  issues: IssueCollector,
  lines: readonly LineConfig[],
  stops: readonly StopConfig[],
  options: Record<number, LineLintOptions>,
) {
  checkLinesUniqueIds(issues, lines);
  checkLinesUniqueUrlPaths(issues, lines);
  checkLinesUniqueNames(issues, lines, options);
  checkLinesAllOrNoneHaveCodes(issues, lines, options);

  for (const [lineIndex, line] of lines.entries()) {
    checkLineHasRoutes(issues, line, lineIndex, options[line.id] ?? {});
    checkLineNonEmptyName(issues, line, lineIndex);
    checkLineNoDuplicateTags(issues, line, lineIndex);

    lintLineRouteConfig(issues, line, lineIndex, stops, options[line.id] ?? {});

    lintLineDiagramConfig(
      issues,
      line,
      lineIndex,
      stops,
      options[line.id] ?? {},
    );
  }
}
