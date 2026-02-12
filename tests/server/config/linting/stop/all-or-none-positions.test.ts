import { describe, it } from "vitest";
import { checkStopsAllOrNoneHavePositions } from "@/server/config/linting/stop/all-or-none-positions.js";
import { collectIssues } from "@/tests/server/config/linting/support/collect-issues.js";
import { expectIssueMessages } from "@/tests/server/config/linting/support/expect-issues.js";
import { createStop } from "@/tests/server/config/linting/support/factories.js";

describe("checkStopsAllOrNoneHavePositions", () => {
  it("returns no issues when all are missing positions", () => {
    const issues = collectIssues(checkStopsAllOrNoneHavePositions, [
      createStop({ id: 1, positions: [] }),
      createStop({ id: 2, positions: [] }),
    ]);

    expectIssueMessages(issues, []);
  });

  it("returns issues when positions are mixed", () => {
    const issues = collectIssues(checkStopsAllOrNoneHavePositions, [
      createStop({ id: 1, positions: [{ stopPositionId: 1, name: "P1" }] }),
      createStop({ id: 2, positions: [] }),
    ]);

    expectIssueMessages(issues, ['Stop "Stop" has no positions.']);
  });

  it("ignores missing positions when configured", () => {
    const issues = collectIssues(
      checkStopsAllOrNoneHavePositions,
      [
        createStop({ id: 1, positions: [{ stopPositionId: 1, name: "P1" }] }),
        createStop({ id: 2, positions: [] }),
      ],
      { 2: { ignoreMissingPosition: true } },
    );

    expectIssueMessages(issues, []);
  });
});
