import type { RouteConfig } from "../../../line-config.js";
import type { StopConfig } from "../../../stop-config.js";
import type { LintIssue } from "../../types.js";
import { createIssue } from "../../utils/helpers.js";

export function checkRouteStopsExist(
  route: RouteConfig,
  routeIndex: number,
  lineIndex: number,
  lineName: string,
  stops: readonly StopConfig[],
): LintIssue[] {
  const issues: LintIssue[] = [];
  const stopIds = new Set(stops.map((stop) => stop.id));

  route.stops.forEach((routeStop, stopIndex) => {
    if (!stopIds.has(routeStop.stopId)) {
      issues.push(
        createIssue(
          `Stop ID ${routeStop.stopId} in route "${route.name}" of line "${lineName}" does not exist in the stop list`,
          `lines[${lineIndex}].routes[${routeIndex}].stops[${stopIndex}].stopId`,
        ),
      );
    }
  });

  return issues;
}
