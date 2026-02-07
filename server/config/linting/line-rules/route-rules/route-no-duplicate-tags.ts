import type { RouteConfig } from "../../../line-config.js";
import type { LintIssue } from "../../types.js";
import { createIssue } from "../../utils/helpers.js";

export function checkRouteNoDuplicateTags(
  route: RouteConfig,
  routeIndex: number,
  lineIndex: number,
  lineName: string,
): LintIssue[] {
  const issues: LintIssue[] = [];
  const seen = new Set<number>();

  route.tags.forEach((tag, tagIndex) => {
    if (seen.has(tag)) {
      issues.push(
        createIssue(
          `Tag ${tag} is duplicated in route "${route.name}" of line "${lineName}"`,
          `lines[${lineIndex}].routes[${routeIndex}].tags[${tagIndex}]`,
        ),
      );
    }
    seen.add(tag);
  });

  return issues;
}
