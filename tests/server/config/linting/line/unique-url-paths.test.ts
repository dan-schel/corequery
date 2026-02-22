import { describe, it } from "vitest";
import { checkLinesUniqueUrlPaths } from "@/server/config/linting/line/unique-url-paths.js";
import { collectIssues } from "@/tests/server/config/linting/support/collect-issues.js";
import { expectIssueMessages } from "@/tests/server/config/linting/support/expect-issues.js";
import { createLine } from "@/tests/server/config/linting/support/factories.js";

describe("checkLinesUniqueUrlPaths", () => {
  it("returns no issues when URL paths are unique", () => {
    const issues = collectIssues(checkLinesUniqueUrlPaths, [
      createLine({ urlPath: "line-1" }),
      createLine({ urlPath: "line-2" }),
    ]);

    expectIssueMessages(issues, []);
  });

  it("returns issues for duplicate URL paths", () => {
    const issues = collectIssues(checkLinesUniqueUrlPaths, [
      createLine({ urlPath: "line" }),
      createLine({ urlPath: "line" }),
    ]);

    expectIssueMessages(issues, ['Line URL path "line" is duplicated.']);
  });
});
