import { describe, expect, it } from "vitest";
import { checkLineRoutesMirrored } from "../../../../../server/config/linting/line-rules/route-rules/routes-mirrored.js";
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
    const issues = checkLineRoutesMirrored(line, 0);
    expect(issues).toEqual([]);
  });

  it("returns issues when routes are not mirrored", () => {
    const routes = [createRoute(1, "Outbound", [1, 2, 3])];
    const line = createLine(routes);
    const issues = checkLineRoutesMirrored(line, 0);
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toContain("does not have a mirrored route");
  });

  it("respects ignore option", () => {
    const routes = [createRoute(1, "Outbound", [1, 2, 3])];
    const line = createLine(routes);
    const issues = checkLineRoutesMirrored(line, 0, {
      routes: { 1: { ignoreMissingMirrored: true } },
    });
    expect(issues).toEqual([]);
  });
});
