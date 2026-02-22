import { describe, it } from "vitest";
import { checkLineNonEmptyCode } from "@/server/config/linting/line/non-empty-code.js";
import { collectIssues } from "@/tests/server/config/linting/support/collect-issues.js";
import { expectIssueMessages } from "@/tests/server/config/linting/support/expect-issues.js";
import { createLine } from "@/tests/server/config/linting/support/factories.js";

describe("checkLinesNonEmptyCodes", () => {
  it("returns no issues when code is non-empty", () => {
    const issues = collectIssues(
      checkLineNonEmptyCode,
      createLine({ id: 1, code: "A" }),
      0,
    );

    expectIssueMessages(issues, []);
  });

  it("returns no issues when code is null", () => {
    const issues = collectIssues(
      checkLineNonEmptyCode,
      createLine({ id: 1, code: null }),
      0,
    );

    expectIssueMessages(issues, []);
  });

  it("returns issues for empty codes", () => {
    const issues = collectIssues(
      checkLineNonEmptyCode,
      createLine({ id: 1, code: "" }),
      0,
    );

    expectIssueMessages(issues, ["Line code is empty."]);
  });
});
