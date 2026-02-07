import { describe, expect, it } from "vitest";
import { checkStopsAllOrNoneHavePositions } from "../../../../../server/config/linting/stop/all-or-none-positions.js";
import { collectIssues } from "../support/collect-issues.js";
import { createStop } from "../support/factories.js";

describe("checkStopsAllOrNoneHavePositions", () => {
  it("returns no issues when all are missing positions", () => {
    const issues = collectIssues(checkStopsAllOrNoneHavePositions, [
      createStop({ id: 1, positions: [] }),
      createStop({ id: 2, positions: [] }),
    ]);

    expect(issues).toEqual([]);
  });

  it("returns issues when positions are mixed", () => {
    const issues = collectIssues(checkStopsAllOrNoneHavePositions, [
      createStop({ id: 1, positions: [{ stopPositionId: 1, name: "P1" }] }),
      createStop({ id: 2, positions: [] }),
    ]);

    expect(issues).toHaveLength(1);
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

    expect(issues).toEqual([]);
  });
});
