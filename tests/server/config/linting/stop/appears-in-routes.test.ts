import { describe, it } from "vitest";
import { checkStopsAppearInRoutes } from "../../../../../server/config/linting/stop/appears-in-routes.js";
import { collectIssues } from "../support/collect-issues.js";
import { expectIssueMessages } from "../support/expect-issues.js";
import { createLine, createStop } from "../support/factories.js";

describe("checkStopsAppearInRoutes", () => {
  it("returns no issues when all stops appear in routes", () => {
    const stops = [createStop({ id: 1 }), createStop({ id: 2 })];
    const lines = [
      createLine({
        routes: [
          {
            id: 1,
            name: "R",
            tags: [],
            stops: [{ stopId: 1, type: "regular" }],
            color: null,
          },
          {
            id: 2,
            name: "R2",
            tags: [],
            stops: [{ stopId: 2, type: "regular" }],
            color: null,
          },
        ],
      }),
    ];

    const issues = collectIssues(checkStopsAppearInRoutes, stops, lines);

    expectIssueMessages(issues, []);
  });

  it("returns issues for unused stops", () => {
    const stops = [createStop({ id: 1 }), createStop({ id: 2 })];
    const lines = [
      createLine({
        routes: [
          {
            id: 1,
            name: "R",
            tags: [],
            stops: [{ stopId: 1, type: "regular" }],
            color: null,
          },
        ],
      }),
    ];

    const issues = collectIssues(checkStopsAppearInRoutes, stops, lines);

    expectIssueMessages(issues, ['Stop "Stop" does not appear in any route.']);
  });

  it("ignores unused stops when configured", () => {
    const stops = [createStop({ id: 1 }), createStop({ id: 2 })];
    const lines = [
      createLine({
        routes: [
          {
            id: 1,
            name: "R",
            tags: [],
            stops: [{ stopId: 1, type: "regular" }],
            color: null,
          },
        ],
      }),
    ];

    const issues = collectIssues(checkStopsAppearInRoutes, stops, lines, {
      2: { ignoreUnusedStop: true },
    });

    expectIssueMessages(issues, []);
  });
});
