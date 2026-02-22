import { describe, it } from "vitest";
import { checkLinesUniqueCodes } from "@/server/config/linting/line/unique-codes.js";
import { collectIssues } from "@/tests/server/config/linting/support/collect-issues.js";
import { expectIssueMessages } from "@/tests/server/config/linting/support/expect-issues.js";
import { createLine } from "@/tests/server/config/linting/support/factories.js";

describe("checkLinesUniqueCodes", () => {
  it("returns no issues when codes are unique", () => {
    const issues = collectIssues(
      checkLinesUniqueCodes,
      [createLine({ id: 1, code: "A" }), createLine({ id: 2, code: "B" })],
      {},
    );

    expectIssueMessages(issues, []);
  });

  it("returns no issues when duplicate missing codes are null", () => {
    const issues = collectIssues(
      checkLinesUniqueCodes,
      [
        createLine({ id: 1, code: null }),
        createLine({ id: 2, code: null }),
        createLine({ id: 3, code: "A" }),
      ],
      {},
    );

    expectIssueMessages(issues, []);
  });

  it("returns issues for duplicate non-null codes", () => {
    const issues = collectIssues(
      checkLinesUniqueCodes,
      [createLine({ id: 1, code: "A" }), createLine({ id: 2, code: "A" })],
      {},
    );

    expectIssueMessages(issues, ['Line code "A" is duplicated.']);
  });

  it("ignores duplicates when configured", () => {
    const issues = collectIssues(
      checkLinesUniqueCodes,
      [createLine({ id: 1, code: "A" }), createLine({ id: 2, code: "A" })],
      { 1: { ignoreDuplicatedCode: true }, 2: { ignoreDuplicatedCode: true } },
    );

    expectIssueMessages(issues, []);
  });
});
