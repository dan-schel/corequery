import { describe, expect, it } from "vitest";
import { checkRouteHasMinimumStops } from "../../../../../../server/config/linting/line/route/route-minimum-stops.js";
import { collectIssues } from "../../support/collect-issues.js";
import { createRoute } from "../../support/factories.js";

describe("checkRouteHasMinimumStops", () => {
  it("returns no issues when route has 2 stops", () => {
    const route = createRoute({
      stops: [
        { stopId: 1, type: "regular" },
        { stopId: 2, type: "regular" },
      ],
    });

    const issues = collectIssues(
      checkRouteHasMinimumStops,
      route,
      0,
      0,
      "Line",
    );

    expect(issues).toEqual([]);
  });

  it("returns issues when route has fewer than 2 stops", () => {
    const route = createRoute({ stops: [{ stopId: 1, type: "regular" }] });
    const issues = collectIssues(
      checkRouteHasMinimumStops,
      route,
      0,
      0,
      "Line",
    );

    expect(issues).toHaveLength(1);
  });
});
