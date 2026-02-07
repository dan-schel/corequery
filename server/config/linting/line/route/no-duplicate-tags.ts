import type { RouteConfig } from "../../../line-config.js";
import { findDuplicates } from "../../utils/find-duplicates.js";
import { IssueCollector } from "../../utils/issue-collector.js";

export function checkRouteNoDuplicateTags(
  issues: IssueCollector,
  route: RouteConfig,
  routeIndex: number,
  lineIndex: number,
  lineName: string,
) {
  const duplicates = findDuplicates(route.tags, (tag) => tag);

  duplicates.forEach((indices, tag) => {
    indices.forEach((index) => {
      issues.add({
        message: `Tag ${tag} is duplicated in route "${route.name}" of line "${lineName}".`,
        path: `lines[${lineIndex}].routes[${routeIndex}].tags[${index}]`,
      });
    });
  });
}
