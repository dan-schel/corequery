import { describe, it } from "vitest";
import { checkStopPositionsUniqueNames } from "@/server/config/linting/stop/position/unique-names.js";
import { collectIssues } from "@/tests/server/config/linting/support/collect-issues.js";
import { expectIssueMessages } from "@/tests/server/config/linting/support/expect-issues.js";
import { createStop } from "@/tests/server/config/linting/support/factories.js";

describe("checkStopPositionsUniqueNames", () => {
  it("returns no issues for unique names", () => {
    const stop = createStop({
      positions: [
        { stopPositionId: 1, name: "A" },
        { stopPositionId: 2, name: "B" },
      ],
    });

    const issues = collectIssues(checkStopPositionsUniqueNames, stop, 0);

    expectIssueMessages(issues, []);
  });

  it("returns issues for duplicate names", () => {
    const stop = createStop({
      positions: [
        { stopPositionId: 1, name: "A" },
        { stopPositionId: 2, name: "A" },
      ],
    });

    const issues = collectIssues(checkStopPositionsUniqueNames, stop, 0);

    expectIssueMessages(issues, [
      'Position name "A" is duplicated in stop "Stop".',
    ]);
  });

  it("ignores duplicate names when configured", () => {
    const stop = createStop({
      positions: [
        { stopPositionId: 1, name: "A" },
        { stopPositionId: 2, name: "A" },
      ],
    });

    const issues = collectIssues(checkStopPositionsUniqueNames, stop, 0, {
      ignoreDuplicatedPositionName: true,
    });

    expectIssueMessages(issues, []);
  });
});
