import { describe, it } from "vitest";
import { checkLinesAllOrNoneHaveColors } from "@/server/config/linting/line/all-or-none-colors.js";
import { collectIssues } from "@/tests/server/config/linting/support/collect-issues.js";
import { expectIssueMessages } from "@/tests/server/config/linting/support/expect-issues.js";
import { createLine } from "@/tests/server/config/linting/support/factories.js";

describe("checkLinesAllOrNoneHaveColors", () => {
  it("returns no issues when all colors are missing", () => {
    const issues = collectIssues(
      checkLinesAllOrNoneHaveColors,
      [createLine({ id: 1, color: null }), createLine({ id: 2, color: null })],
      {},
    );

    expectIssueMessages(issues, []);
  });

  it("returns issues when colors are mixed", () => {
    const issues = collectIssues(
      checkLinesAllOrNoneHaveColors,
      [createLine({ id: 1, color: "red" }), createLine({ id: 2, color: null })],
      {},
    );

    expectIssueMessages(issues, ['Line "Line" is missing a color.']);
  });

  it("ignores missing colors when configured", () => {
    const issues = collectIssues(
      checkLinesAllOrNoneHaveColors,
      [createLine({ id: 1, color: "red" }), createLine({ id: 2, color: null })],
      { 2: { ignoreMissingColor: true } },
    );

    expectIssueMessages(issues, []);
  });
});
