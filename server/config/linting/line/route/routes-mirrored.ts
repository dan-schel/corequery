import type {
  LineConfig,
  RouteConfig,
} from "@/server/config/types/line-config.js";
import type { LineLintOptions } from "@/server/config/linting/types.js";
import { IssueCollector } from "@/server/config/linting/utils/issue-collector.js";
import { itsOk } from "@dan-schel/js-utils";

export function checkLineRoutesMirrored(
  issues: IssueCollector,
  line: LineConfig,
  lineIndex: number,
  options: LineLintOptions,
) {
  for (const [routeIndex, route] of line.routes.entries()) {
    if (options.routes?.[route.id]?.ignoreMissingMirrored ?? false) continue;

    const hasMirror = line.routes.some(
      (otherRoute, otherIndex) =>
        otherIndex !== routeIndex && routesAreMirrored(route, otherRoute),
    );

    if (!hasMirror) {
      issues.add({
        message: `Route "${route.name}" in line "${line.name}" does not have a mirrored route.`,
        path: `lines[${lineIndex}].routes[${routeIndex}]`,
      });
    }
  }
}

function routesAreMirrored(route1: RouteConfig, route2: RouteConfig): boolean {
  if (route1.stops.length !== route2.stops.length) return false;

  for (let i = 0; i < route1.stops.length; i++) {
    const stop1 = itsOk(route1.stops[i]);
    const stop2 = itsOk(route2.stops[route2.stops.length - 1 - i]);

    if (stop1.stopId !== stop2.stopId || stop1.type !== stop2.type) {
      return false;
    }
  }

  return true;
}
