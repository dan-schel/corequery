import { describe, expect, it } from "vitest";
import { checkRouteStopsExist } from "../../../../../../server/config/linting/line/route/route-stops-exist.js";
import { collectIssues } from "../../support/collect-issues.js";
import { createRoute, createStop } from "../../support/factories.js";

describe("checkRouteStopsExist", () => {
  it("returns no issues when stops exist", () => {
    const route = createRoute({ stops: [{ stopId: 1, type: "regular" }] });
    const stops = [createStop({ id: 1 })];

    const issues = collectIssues(
      checkRouteStopsExist,
      route,
      0,
      0,
      "Line",
      stops,
    );

    expect(issues).toEqual([]);
  });

  it("returns issues when stop is missing", () => {
    const route = createRoute({ stops: [{ stopId: 2, type: "regular" }] });
    const stops = [createStop({ id: 1 })];

    const issues = collectIssues(
      checkRouteStopsExist,
      route,
      0,
      0,
      "Line",
      stops,
    );

    expect(issues).toHaveLength(1);
  });
});
