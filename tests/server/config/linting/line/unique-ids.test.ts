import { describe, it } from "vitest";
import { checkLinesUniqueIds } from "@/server/config/linting/line/unique-ids.js";
import { collectIssues } from "@/tests/server/config/linting/support/collect-issues.js";
import { expectIssueMessages } from "@/tests/server/config/linting/support/expect-issues.js";
import { createLine } from "@/tests/server/config/linting/support/factories.js";

describe("checkLinesUniqueIds", () => {
  it("returns no issues when IDs are unique", () => {
    const issues = collectIssues(checkLinesUniqueIds, [
      createLine({ id: 1 }),
      createLine({ id: 2 }),
    ]);

    expectIssueMessages(issues, []);
  });

  it("returns issues for duplicate IDs", () => {
    const issues = collectIssues(checkLinesUniqueIds, [
      createLine({ id: 1 }),
      createLine({ id: 1 }),
    ]);

    expectIssueMessages(issues, ["Line ID 1 is duplicated."]);
  });
});
