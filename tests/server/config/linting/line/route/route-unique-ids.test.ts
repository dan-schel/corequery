import { describe, expect, it } from "vitest";
import { checkLineRoutesUniqueIds } from "../../../../../../server/config/linting/line/route/route-unique-ids.js";
import { collectIssues } from "../../support/collect-issues.js";
import { createLine, createRoute } from "../../support/factories.js";

describe("checkLineRoutesUniqueIds", () => {
  it("returns no issues when route IDs are unique", () => {
    const line = createLine({
      routes: [createRoute({ id: 1 }), createRoute({ id: 2 })],
    });

    const issues = collectIssues(checkLineRoutesUniqueIds, line, 0);

    expect(issues).toEqual([]);
  });

  it("returns issues for duplicate route IDs", () => {
    const line = createLine({
      routes: [createRoute({ id: 1 }), createRoute({ id: 1 })],
    });

    const issues = collectIssues(checkLineRoutesUniqueIds, line, 0);

    expect(issues).toHaveLength(2);
  });
});
