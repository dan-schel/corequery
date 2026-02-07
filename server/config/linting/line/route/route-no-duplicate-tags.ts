import type { RouteConfig } from "../../../line-config.js";
import { IssueCollector } from "../../utils/issue-collector.js";

export function checkRouteNoDuplicateTags(
  issues: IssueCollector,
  route: RouteConfig,
  routeIndex: number,
  lineIndex: number,
  lineName: string,
) {
  const seen = new Set<number>();

  route.tags.forEach((tag, tagIndex) => {
    if (seen.has(tag)) {
      issues.add({
        message: `Tag ${tag} is duplicated in route "${route.name}" of line "${lineName}".`,
        path: `lines[${lineIndex}].routes[${routeIndex}].tags[${tagIndex}]`,
      });
    }
    seen.add(tag);
  });
}
