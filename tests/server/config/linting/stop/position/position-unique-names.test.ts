import { describe, expect, it } from "vitest";
import { checkStopPositionsUniqueNames } from "../../../../../../server/config/linting/stop/position/position-unique-names.js";
import { collectIssues } from "../../support/collect-issues.js";
import { createStop } from "../../support/factories.js";

describe("checkStopPositionsUniqueNames", () => {
  it("returns no issues for unique names", () => {
    const stop = createStop({
      positions: [
        { stopPositionId: 1, name: "A" },
        { stopPositionId: 2, name: "B" },
      ],
    });

    const issues = collectIssues(checkStopPositionsUniqueNames, stop, 0);

    expect(issues).toEqual([]);
  });

  it("returns issues for duplicate names", () => {
    const stop = createStop({
      positions: [
        { stopPositionId: 1, name: "A" },
        { stopPositionId: 2, name: "A" },
      ],
    });

    const issues = collectIssues(checkStopPositionsUniqueNames, stop, 0);

    expect(issues).toHaveLength(2);
  });
});
