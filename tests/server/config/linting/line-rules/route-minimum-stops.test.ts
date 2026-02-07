import { describe, expect, it } from "vitest";
import { checkRouteHasMinimumStops } from "../../../../../server/config/linting/line-rules/route-rules/route-minimum-stops.js";
import { IssueCollector } from "../../../../../server/config/linting/utils/issue-collector.js";
import type { RouteConfig } from "../../../../../server/config/line-config.js";

const createRoute = (stopCount: number): RouteConfig => ({
  id: 1,
  name: "Route",
  tags: [],
  stops: Array.from({ length: stopCount }, (_, i) => ({
    stopId: i,
    type: "regular" as const,
  })),
  color: null,
});

describe("checkRouteHasMinimumStops", () => {
  it("returns no issues for 2 or more stops", () => {
    const route = createRoute(2);
    const collector = new IssueCollector();
    checkRouteHasMinimumStops(collector, route, 0, 0, "Line");
    const issues = collector.getIssues();
    expect(issues).toEqual([]);
  });

  it("returns issues for fewer than 2 stops", () => {
    const route = createRoute(1);
    const collector = new IssueCollector();
    checkRouteHasMinimumStops(collector, route, 0, 0, "Line");
    const issues = collector.getIssues();
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toContain("has fewer than 2 stops");
  });
});
