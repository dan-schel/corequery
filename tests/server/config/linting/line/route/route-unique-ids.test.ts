import { describe, it } from "vitest";
import { checkLineRoutesUniqueIds } from "../../../../../../server/config/linting/line/route/route-unique-ids.js";
import { collectIssues } from "../../support/collect-issues.js";
import { expectIssueMessages } from "../../support/expect-issues.js";
import { createLine, createRoute } from "../../support/factories.js";

describe("checkLineRoutesUniqueIds", () => {
  it("returns no issues when route IDs are unique", () => {
    const line = createLine({
      routes: [createRoute({ id: 1 }), createRoute({ id: 2 })],
    });

    const issues = collectIssues(checkLineRoutesUniqueIds, line, 0);

    expectIssueMessages(issues, []);
  });

  it("returns issues for duplicate route IDs", () => {
    const line = createLine({
      routes: [createRoute({ id: 1 }), createRoute({ id: 1 })],
    });

    const issues = collectIssues(checkLineRoutesUniqueIds, line, 0);

    expectIssueMessages(issues, [
      'Route ID 1 is duplicated in line "Line"',
      'Route ID 1 is duplicated in line "Line"',
    ]);
  });
});
