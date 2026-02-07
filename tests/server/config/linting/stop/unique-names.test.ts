import { describe, it } from "vitest";
import { checkStopsUniqueNames } from "../../../../../server/config/linting/stop/unique-names.js";
import { collectIssues } from "../support/collect-issues.js";
import { expectIssueMessages } from "../support/expect-issues.js";
import { createStop } from "../support/factories.js";

describe("checkStopsUniqueNames", () => {
  it("returns no issues when names are unique", () => {
    const issues = collectIssues(checkStopsUniqueNames, [
      createStop({ id: 1, name: "A" }),
      createStop({ id: 2, name: "B" }),
    ]);

    expectIssueMessages(issues, []);
  });

  it("returns issues for duplicate names", () => {
    const issues = collectIssues(checkStopsUniqueNames, [
      createStop({ id: 1, name: "A" }),
      createStop({ id: 2, name: "A" }),
    ]);

    expectIssueMessages(issues, [
      'Stop name "A" is duplicated.',
      'Stop name "A" is duplicated.',
    ]);
  });

  it("ignores duplicates when configured", () => {
    const issues = collectIssues(
      checkStopsUniqueNames,
      [createStop({ id: 1, name: "A" }), createStop({ id: 2, name: "A" })],
      { 1: { ignoreDuplicatedName: true }, 2: { ignoreDuplicatedName: true } },
    );

    expectIssueMessages(issues, []);
  });
});
