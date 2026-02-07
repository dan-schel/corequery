import { describe, it } from "vitest";
import { checkLineNonEmptyName } from "../../../../../server/config/linting/line/non-empty-name.js";
import { collectIssues } from "../support/collect-issues.js";
import { expectIssueMessages } from "../support/expect-issues.js";
import { createLine } from "../support/factories.js";

describe("checkLinesNonEmptyNames", () => {
  it("returns no issues when names are non-empty", () => {
    const issues = collectIssues(
      checkLineNonEmptyName,
      createLine({ id: 1, name: "A" }),
      0,
    );

    expectIssueMessages(issues, []);
  });

  it("returns issues for empty names", () => {
    const issues = collectIssues(
      checkLineNonEmptyName,
      createLine({ id: 1, name: "" }),
      0,
    );

    expectIssueMessages(issues, ["Line name is empty."]);
  });
});
