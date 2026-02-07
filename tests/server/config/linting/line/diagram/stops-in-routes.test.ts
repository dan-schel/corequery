import { describe, it } from "vitest";
import { checkLineDiagramStopsInRoutes } from "@/server/config/linting/line/diagram/stops-in-routes.js";
import { collectIssues } from "@/tests/server/config/linting/support/collect-issues.js";
import { expectIssueMessages } from "@/tests/server/config/linting/support/expect-issues.js";
import {
  createLine,
  createRoute,
} from "@/tests/server/config/linting/support/factories.js";

describe("checkLineDiagramStopsInRoutes", () => {
  it("returns no issues when diagram stops are in routes", () => {
    const line = createLine({
      routes: [createRoute({ stops: [{ stopId: 1, type: "regular" }] })],
      diagram: {
        entries: [
          { name: null, color: "red", stops: [{ stopId: 1, type: "regular" }] },
        ],
      },
    });

    const issues = collectIssues(checkLineDiagramStopsInRoutes, line, 0);

    expectIssueMessages(issues, []);
  });

  it("returns issues when diagram stop is not in any route", () => {
    const line = createLine({
      routes: [createRoute({ stops: [{ stopId: 1, type: "regular" }] })],
      diagram: {
        entries: [
          { name: null, color: "red", stops: [{ stopId: 2, type: "regular" }] },
        ],
      },
    });

    const issues = collectIssues(checkLineDiagramStopsInRoutes, line, 0);

    expectIssueMessages(issues, [
      'Stop ID 2 in diagram entry <Entry 1> of line "Line" does not exist in any route.',
    ]);
  });

  it("ignores missing route stops when configured", () => {
    const line = createLine({
      routes: [createRoute({ stops: [{ stopId: 1, type: "regular" }] })],
      diagram: {
        entries: [
          { name: null, color: "red", stops: [{ stopId: 2, type: "regular" }] },
        ],
      },
    });

    const issues = collectIssues(checkLineDiagramStopsInRoutes, line, 0, {
      ignoreDiagramStopNotInRoute: true,
    });

    expectIssueMessages(issues, []);
  });
});
