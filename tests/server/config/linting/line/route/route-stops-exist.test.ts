import { describe, it } from "vitest";
import { checkRouteStopsExist } from "../../../../../../server/config/linting/line/route/route-stops-exist.js";
import { collectIssues } from "../../support/collect-issues.js";
import { expectIssueMessages } from "../../support/expect-issues.js";
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

    expectIssueMessages(issues, []);
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

    expectIssueMessages(issues, [
      'Stop ID 2 in route "Route" of line "Line" does not exist in the stop list.',
    ]);
  });
});
