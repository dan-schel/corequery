import { describe, expect, it } from "vitest";
import { checkStopsAppearInRoutes } from "../../../../../server/config/linting/stop/appears-in-routes.js";
import { collectIssues } from "../support/collect-issues.js";
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

    expect(issues).toEqual([]);
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

    expect(issues).toHaveLength(1);
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

    expect(issues).toEqual([]);
  });
});
