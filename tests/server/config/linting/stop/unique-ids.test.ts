import { describe, it } from "vitest";
import { checkStopsUniqueIds } from "../../../../../server/config/linting/stop/unique-ids.js";
import { collectIssues } from "../support/collect-issues.js";
import { expectIssueMessages } from "../support/expect-issues.js";
import { createStop } from "../support/factories.js";

describe("checkStopsUniqueIds", () => {
  it("returns no issues when IDs are unique", () => {
    const issues = collectIssues(checkStopsUniqueIds, [
      createStop({ id: 1 }),
      createStop({ id: 2 }),
    ]);

    expectIssueMessages(issues, []);
  });

  it("returns issues for duplicate IDs", () => {
    const issues = collectIssues(checkStopsUniqueIds, [
      createStop({ id: 1 }),
      createStop({ id: 1 }),
    ]);

    expectIssueMessages(issues, [
      "Stop ID 1 is duplicated.",
      "Stop ID 1 is duplicated.",
    ]);
  });
});
