import type { RouteConfig } from "@/server/config/types/line-config.js";
import { findDuplicates } from "@/server/config/linting/utils/find-duplicates.js";
import { IssueCollector } from "@/server/config/linting/utils/issue-collector.js";

export function checkRouteNoDuplicateTags(
  issues: IssueCollector,
  route: RouteConfig,
  routeIndex: number,
  lineIndex: number,
  lineName: string,
) {
  const duplicates = findDuplicates(route.tags, (tag) => tag);

  for (const [tag, indices] of duplicates) {
    for (const index of indices) {
      issues.add({
        message: `Tag ${tag} is duplicated in route "${route.name}" of line "${lineName}".`,
        path: `lines[${lineIndex}].routes[${routeIndex}].tags[${index}]`,
      });
    }
  }
}
