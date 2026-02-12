import type { RouteConfig } from "@/server/config/types/line-config.js";
import { IssueCollector } from "@/server/config/linting/utils/issue-collector.js";

export function checkLineRouteNonEmptyName(
  issues: IssueCollector,
  route: RouteConfig,
  routeIndex: number,
  lineIndex: number,
) {
  if (route.name.length === 0) {
    issues.add({
      message: `Route name is empty.`,
      path: `lines[${lineIndex}].routes[${routeIndex}].name`,
    });
  }
}
