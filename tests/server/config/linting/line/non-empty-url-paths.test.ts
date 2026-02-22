import { describe, it } from "vitest";
import { checkLineNonEmptyUrlPath } from "@/server/config/linting/line/non-empty-url-path.js";
import { collectIssues } from "@/tests/server/config/linting/support/collect-issues.js";
import { expectIssueMessages } from "@/tests/server/config/linting/support/expect-issues.js";
import { createLine } from "@/tests/server/config/linting/support/factories.js";

describe("checkLinesNonEmptyUrlPaths", () => {
  it("returns no issues when URL paths are non-empty", () => {
    const issues = collectIssues(
      checkLineNonEmptyUrlPath,
      createLine({ id: 1, urlPath: "/line" }),
      0,
    );

    expectIssueMessages(issues, []);
  });

  it("returns issues for empty URL paths", () => {
    const issues = collectIssues(
      checkLineNonEmptyUrlPath,
      createLine({ id: 1, urlPath: "" }),
      0,
    );

    expectIssueMessages(issues, ["Line URL path is empty."]);
  });
});
