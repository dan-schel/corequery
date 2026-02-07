import { describe, expect, it } from "vitest";
import { checkLineRoutesMirrored } from "../../../../../server/config/linting/line/route/routes-mirrored.js";
import { IssueCollector } from "../../../../../server/config/linting/utils/issue-collector.js";
import type {
  LineConfig,
  RouteConfig,
} from "../../../../../server/config/line-config.js";

const createRoute = (
  id: number,
  name: string,
  stopIds: number[],
): RouteConfig => ({
  id,
  name,
  tags: [],
  stops: stopIds.map((stopId) => ({ stopId, type: "regular" as const })),
  color: null,
});

const createLine = (routes: RouteConfig[]): LineConfig => ({
  id: 1,
  name: "Line",
  code: null,
  tags: [],
  urlPath: "/line",
  routes,
  diagram: { entries: [] },
});

describe("checkLineRoutesMirrored", () => {
  it("returns no issues when routes are mirrored", () => {
    const routes = [
      createRoute(1, "Outbound", [1, 2, 3]),
      createRoute(2, "Inbound", [3, 2, 1]),
    ];
    const line = createLine(routes);
    const collector = new IssueCollector();
    checkLineRoutesMirrored(collector, line, 0);
    const issues = collector.getIssues();
    expect(issues).toEqual([]);
  });

  it("returns issues when routes are not mirrored", () => {
    const routes = [createRoute(1, "Outbound", [1, 2, 3])];
    const line = createLine(routes);
    const collector = new IssueCollector();
    checkLineRoutesMirrored(collector, line, 0);
    const issues = collector.getIssues();
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toContain("does not have a mirrored route");
  });

  it("respects ignore option", () => {
    const routes = [createRoute(1, "Outbound", [1, 2, 3])];
    const line = createLine(routes);
    const collector = new IssueCollector();
    checkLineRoutesMirrored(collector, line, 0, {
      routes: { 1: { ignoreMissingMirrored: true } },
    });
    const issues = collector.getIssues();
    expect(issues).toEqual([]);
  });
});
