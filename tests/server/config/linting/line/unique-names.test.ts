import { describe, expect, it } from "vitest";
import { checkLinesUniqueNames } from "../../../../../server/config/linting/line/unique-names.js";
import { collectIssues } from "../support/collect-issues.js";
import { createLine } from "../support/factories.js";

describe("checkLinesUniqueNames", () => {
  it("returns no issues when names are unique", () => {
    const issues = collectIssues(checkLinesUniqueNames, [
      createLine({ id: 1, name: "A" }),
      createLine({ id: 2, name: "B" }),
    ]);

    expect(issues).toEqual([]);
  });

  it("returns issues for duplicate names", () => {
    const issues = collectIssues(checkLinesUniqueNames, [
      createLine({ id: 1, name: "A" }),
      createLine({ id: 2, name: "A" }),
    ]);

    expect(issues).toHaveLength(2);
  });

  it("ignores duplicates when configured", () => {
    const issues = collectIssues(
      checkLinesUniqueNames,
      [createLine({ id: 1, name: "A" }), createLine({ id: 2, name: "A" })],
      { 1: { ignoreDuplicatedName: true }, 2: { ignoreDuplicatedName: true } },
    );

    expect(issues).toEqual([]);
  });
});
