import { describe, expect, it } from "vitest";
import { checkLinesAllOrNoneHaveCodes } from "../../../../../server/config/linting/line/all-or-none-codes.js";
import { collectIssues } from "../support/collect-issues.js";
import { createLine } from "../support/factories.js";

describe("checkLinesAllOrNoneHaveCodes", () => {
  it("returns no issues when all codes are missing", () => {
    const issues = collectIssues(checkLinesAllOrNoneHaveCodes, [
      createLine({ id: 1, code: null }),
      createLine({ id: 2, code: null }),
    ]);

    expect(issues).toEqual([]);
  });

  it("returns issues when codes are mixed", () => {
    const issues = collectIssues(checkLinesAllOrNoneHaveCodes, [
      createLine({ id: 1, code: "A" }),
      createLine({ id: 2, code: null }),
    ]);

    expect(issues).toHaveLength(1);
  });

  it("ignores missing codes when configured", () => {
    const issues = collectIssues(
      checkLinesAllOrNoneHaveCodes,
      [createLine({ id: 1, code: "A" }), createLine({ id: 2, code: null })],
      { 2: { ignoreMissingCode: true } },
    );

    expect(issues).toEqual([]);
  });
});
