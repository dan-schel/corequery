import { describe, it } from "vitest";
import { checkStopNonEmptyName } from "../../../../../server/config/linting/stop/non-empty-name.js";
import { collectIssues } from "../support/collect-issues.js";
import { expectIssueMessages } from "../support/expect-issues.js";
import { createStop } from "../support/factories.js";

describe("checkStopsNonEmptyNames", () => {
  it("returns no issues when names are non-empty", () => {
    const issues = collectIssues(
      checkStopNonEmptyName,
      createStop({ id: 1, name: "A" }),
      0,
    );

    expectIssueMessages(issues, []);
  });

  it("returns issues for empty names", () => {
    const issues = collectIssues(
      checkStopNonEmptyName,
      createStop({ id: 1, name: "" }),
      0,
    );

    expectIssueMessages(issues, ["Stop name is empty."]);
  });
});
