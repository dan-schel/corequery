import { describe, it } from "vitest";
import { checkStopsUniqueUrlPaths } from "@/server/config/linting/stop/unique-url-paths.js";
import { collectIssues } from "@/tests/server/config/linting/support/collect-issues.js";
import { expectIssueMessages } from "@/tests/server/config/linting/support/expect-issues.js";
import { createStop } from "@/tests/server/config/linting/support/factories.js";

describe("checkStopsUniqueUrlPaths", () => {
  it("returns no issues when URL paths are unique", () => {
    const issues = collectIssues(checkStopsUniqueUrlPaths, [
      createStop({ urlPath: "stop-1" }),
      createStop({ urlPath: "stop-2" }),
    ]);

    expectIssueMessages(issues, []);
  });

  it("returns issues for duplicate URL paths", () => {
    const issues = collectIssues(checkStopsUniqueUrlPaths, [
      createStop({ urlPath: "stop" }),
      createStop({ urlPath: "stop" }),
    ]);

    expectIssueMessages(issues, ['Stop URL path "stop" is duplicated.']);
  });
});
