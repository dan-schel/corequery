import { describe, expect, it } from "vitest";
import { checkStopPositionsUniqueIds } from "../../../../../../server/config/linting/stop/position/position-unique-ids.js";
import { collectIssues } from "../../support/collect-issues.js";
import { createStop } from "../../support/factories.js";

describe("checkStopPositionsUniqueIds", () => {
  it("returns no issues for unique IDs", () => {
    const stop = createStop({
      positions: [
        { stopPositionId: 1, name: "A" },
        { stopPositionId: 2, name: "B" },
      ],
    });

    const issues = collectIssues(checkStopPositionsUniqueIds, stop, 0);

    expect(issues).toEqual([]);
  });

  it("returns issues for duplicate IDs", () => {
    const stop = createStop({
      positions: [
        { stopPositionId: 1, name: "A" },
        { stopPositionId: 1, name: "B" },
      ],
    });

    const issues = collectIssues(checkStopPositionsUniqueIds, stop, 0);

    expect(issues).toHaveLength(2);
  });
});
