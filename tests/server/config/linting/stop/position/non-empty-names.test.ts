import { describe, it } from "vitest";
import { checkStopPositionNonEmptyName } from "@/server/config/linting/stop/position/non-empty-name.js";
import { collectIssues } from "@/tests/server/config/linting/support/collect-issues.js";
import { expectIssueMessages } from "@/tests/server/config/linting/support/expect-issues.js";

describe("checkStopPositionsNonEmptyNames", () => {
  it("returns no issues when position names are non-empty", () => {
    const position = { stopPositionId: 1, name: "A" };

    const issues = collectIssues(checkStopPositionNonEmptyName, position, 0, 0);

    expectIssueMessages(issues, []);
  });

  it("returns issues for empty position names", () => {
    const position = { stopPositionId: 1, name: "" };

    const issues = collectIssues(checkStopPositionNonEmptyName, position, 0, 0);

    expectIssueMessages(issues, ["Position name is empty."]);
  });
});
