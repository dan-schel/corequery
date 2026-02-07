import type { RouteConfig } from "../../../line-config.js";
import type { LintIssue } from "../../types.js";
import { createIssue } from "../../utils/helpers.js";

export function checkRouteHasMinimumStops(
  route: RouteConfig,
  routeIndex: number,
  lineIndex: number,
  lineName: string,
): LintIssue[] {
  const issues: LintIssue[] = [];

  if (route.stops.length < 2) {
    issues.push(
      createIssue(
        `Route "${route.name}" in line "${lineName}" has fewer than 2 stops`,
        `lines[${lineIndex}].routes[${routeIndex}].stops`,
      ),
    );
  }

  return issues;
}
