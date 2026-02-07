import { describe, expect, it } from "vitest";
import { checkLineDiagramStopsInRoutes } from "../../../../../../server/config/linting/line/diagram/diagram-stops-in-routes.js";
import { collectIssues } from "../../support/collect-issues.js";
import { createLine, createRoute } from "../../support/factories.js";

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

    expect(issues).toEqual([]);
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

    expect(issues).toHaveLength(1);
  });
});
