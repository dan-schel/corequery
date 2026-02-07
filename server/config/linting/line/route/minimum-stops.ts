import type { RouteConfig } from "../../../line-config.js";
import { IssueCollector } from "../../utils/issue-collector.js";

export function checkRouteHasMinimumStops(
  issues: IssueCollector,
  route: RouteConfig,
  routeIndex: number,
  lineIndex: number,
  lineName: string,
) {
  if (route.stops.length < 2) {
    issues.add({
      message: `Route "${route.name}" in line "${lineName}" has fewer than 2 stops.`,
      path: `lines[${lineIndex}].routes[${routeIndex}].stops`,
    });
  }
}
