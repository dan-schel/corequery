import { describe, it } from "vitest";
import { checkStopsAppearInDiagrams } from "@/server/config/linting/stop/appears-in-diagrams.js";
import { collectIssues } from "@/tests/server/config/linting/support/collect-issues.js";
import { expectIssueMessages } from "@/tests/server/config/linting/support/expect-issues.js";
import {
  createDiagramWithStops,
  createLine,
  createStop,
} from "@/tests/server/config/linting/support/factories.js";

describe("checkStopsAppearInDiagrams", () => {
  it("returns no issues when all stops appear in diagrams", () => {
    const stops = [createStop({ id: 1 }), createStop({ id: 2 })];
    const lines = [
      createLine({
        diagram: createDiagramWithStops([1, 2]),
      }),
    ];

    const issues = collectIssues(checkStopsAppearInDiagrams, stops, lines, {});

    expectIssueMessages(issues, []);
  });

  it("returns issues for unused stops", () => {
    const stops = [createStop({ id: 1 }), createStop({ id: 2 })];
    const lines = [
      createLine({
        diagram: createDiagramWithStops([1, 3]),
      }),
    ];

    const issues = collectIssues(checkStopsAppearInDiagrams, stops, lines, {});

    expectIssueMessages(issues, [
      'Stop "Stop" does not appear in any diagram.',
    ]);
  });

  it("ignores unused stops when configured", () => {
    const stops = [createStop({ id: 1 }), createStop({ id: 2 })];
    const lines = [
      createLine({
        diagram: createDiagramWithStops([1, 3]),
      }),
    ];

    const issues = collectIssues(checkStopsAppearInDiagrams, stops, lines, {
      2: { ignoreUnusedStop: true },
    });

    expectIssueMessages(issues, []);
  });
});
