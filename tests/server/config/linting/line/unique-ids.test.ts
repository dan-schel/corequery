import { describe, expect, it } from "vitest";
import { checkLinesUniqueIds } from "../../../../../server/config/linting/line/unique-ids.js";
import { collectIssues } from "../support/collect-issues.js";
import { createLine } from "../support/factories.js";

describe("checkLinesUniqueIds", () => {
  it("returns no issues when IDs are unique", () => {
    const issues = collectIssues(checkLinesUniqueIds, [
      createLine({ id: 1 }),
      createLine({ id: 2 }),
    ]);

    expect(issues).toEqual([]);
  });

  it("returns issues for duplicate IDs", () => {
    const issues = collectIssues(checkLinesUniqueIds, [
      createLine({ id: 1 }),
      createLine({ id: 1 }),
    ]);

    expect(issues).toHaveLength(2);
  });
});
