import type { RouteConfig } from "@/server/config/types/line-config.js";
import type { StopConfig } from "@/server/config/types/stop-config.js";
import { IssueCollector } from "@/server/config/linting/utils/issue-collector.js";

export function checkRouteStopsExist(
  issues: IssueCollector,
  route: RouteConfig,
  routeIndex: number,
  lineIndex: number,
  lineName: string,
  stops: readonly StopConfig[],
) {
  const stopIds = new Set(stops.map((stop) => stop.id));

  for (const [stopIndex, routeStop] of route.stops.entries()) {
    if (!stopIds.has(routeStop.stopId)) {
      issues.add({
        message: `Stop ID ${routeStop.stopId} in route "${route.name}" of line "${lineName}" does not exist in the stop list.`,
        path: `lines[${lineIndex}].routes[${routeIndex}].stops[${stopIndex}].stopId`,
      });
    }
  }
}
