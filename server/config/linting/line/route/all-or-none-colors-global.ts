import type { LineConfig } from "@/server/config/types/line-config.js";
import type { LineLintOptions } from "@/server/config/linting/types.js";
import { findAllOrNoneViolations } from "@/server/config/linting/utils/find-all-or-none-violations.js";
import { IssueCollector } from "@/server/config/linting/utils/issue-collector.js";

export function checkRoutesAllOrNoneHaveColors(
  issues: IssueCollector,
  lines: readonly LineConfig[],
  options: Record<number, LineLintOptions>,
) {
  const routesToCheck: Array<{
    route: LineConfig["routes"][number];
    lineIndex: number;
    routeIndex: number;
  }> = [];

  for (const [lineIndex, line] of lines.entries()) {
    for (const [routeIndex, route] of line.routes.entries()) {
      if (
        !(options[line.id]?.routes?.[route.id]?.ignoreMissingColor ?? false)
      ) {
        routesToCheck.push({ route, lineIndex, routeIndex });
      }
    }
  }

  const missingColors = findAllOrNoneViolations(
    routesToCheck,
    ({ route }) => route.color !== null,
  );

  for (const { item } of missingColors ?? []) {
    issues.add({
      message: `Route "${item.route.name}" is missing a color.`,
      path: `lines[${item.lineIndex}].routes[${item.routeIndex}].color`,
    });
  }
}
