import { describe, it } from "vitest";
import { checkRouteHasMinimumStops } from "@/server/config/linting/line/route/minimum-stops.js";
import { collectIssues } from "@/tests/server/config/linting/support/collect-issues.js";
import { expectIssueMessages } from "@/tests/server/config/linting/support/expect-issues.js";
import { createRoute } from "@/tests/server/config/linting/support/factories.js";

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

    expectIssueMessages(issues, []);
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

    expectIssueMessages(issues, [
      'Route "Route" in line "Line" has fewer than 2 stops.',
    ]);
  });
});
