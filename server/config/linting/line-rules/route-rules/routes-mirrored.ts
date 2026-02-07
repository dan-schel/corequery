import type { LineConfig, RouteConfig } from "../../../line-config.js";
import type { LintIssue, LineLintOptions } from "../../types.js";
import { createIssue } from "../../utils/helpers.js";

export function checkLineRoutesMirrored(
  line: LineConfig,
  lineIndex: number,
  options?: LineLintOptions,
): LintIssue[] {
  const issues: LintIssue[] = [];

  line.routes.forEach((route, routeIndex) => {
    if (options?.routes?.[route.id]?.ignoreMissingMirrored) {
      return;
    }

    const hasMirror = line.routes.some(
      (otherRoute, otherIndex) =>
        otherIndex !== routeIndex && routesAreMirrored(route, otherRoute),
    );

    if (!hasMirror) {
      issues.push(
        createIssue(
          `Route "${route.name}" in line "${line.name}" does not have a mirrored route`,
          `lines[${lineIndex}].routes[${routeIndex}]`,
        ),
      );
    }
  });

  return issues;
}

function routesAreMirrored(route1: RouteConfig, route2: RouteConfig): boolean {
  if (route1.stops.length !== route2.stops.length) {
    return false;
  }

  for (let i = 0; i < route1.stops.length; i++) {
    const stop1 = route1.stops[i];
    const stop2 = route2.stops[route2.stops.length - 1 - i];

    if (!stop1 || !stop2) {
      return false;
    }

    if (stop1.stopId !== stop2.stopId || stop1.type !== stop2.type) {
      return false;
    }
  }

  return true;
}
