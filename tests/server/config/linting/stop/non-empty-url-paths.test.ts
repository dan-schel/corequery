import { describe, it } from "vitest";
import { checkStopNonEmptyUrlPath } from "@/server/config/linting/stop/non-empty-url-path.js";
import { collectIssues } from "@/tests/server/config/linting/support/collect-issues.js";
import { expectIssueMessages } from "@/tests/server/config/linting/support/expect-issues.js";
import { createStop } from "@/tests/server/config/linting/support/factories.js";

describe("checkStopsNonEmptyUrlPaths", () => {
  it("returns no issues when URL paths are non-empty", () => {
    const issues = collectIssues(
      checkStopNonEmptyUrlPath,
      createStop({ id: 1, urlPath: "/stop" }),
      0,
    );

    expectIssueMessages(issues, []);
  });

  it("returns issues for empty URL paths", () => {
    const issues = collectIssues(
      checkStopNonEmptyUrlPath,
      createStop({ id: 1, urlPath: "" }),
      0,
    );

    expectIssueMessages(issues, ["Stop URL path is empty."]);
  });
});
