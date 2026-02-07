import { describe, it } from "vitest";
import { checkLinesUniqueIds } from "../../../../../server/config/linting/line/unique-ids.js";
import { collectIssues } from "../support/collect-issues.js";
import { expectIssueMessages } from "../support/expect-issues.js";
import { createLine } from "../support/factories.js";

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

    expectIssueMessages(issues, [
      "Line ID 1 is duplicated.",
      "Line ID 1 is duplicated.",
    ]);
  });
});
