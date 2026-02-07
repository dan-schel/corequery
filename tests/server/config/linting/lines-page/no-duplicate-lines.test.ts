import { describe, it } from "vitest";
import { checkLinesPageNoDuplicateLines } from "../../../../../server/config/linting/lines-page/no-duplicate-lines.js";
import { collectIssues } from "../support/collect-issues.js";
import { expectIssueMessages } from "../support/expect-issues.js";
import { createLine, createLinesPage } from "../support/factories.js";

describe("checkLinesPageNoDuplicateLines", () => {
  it("returns no issues when lines appear once", () => {
    const lines = [createLine({ id: 1, tags: [10] })];
    const linesPage = createLinesPage({ sections: [{ tag: 10, name: "A" }] });

    const issues = collectIssues(
      checkLinesPageNoDuplicateLines,
      linesPage,
      lines,
      {},
    );

    expectIssueMessages(issues, []);
  });

  it("returns issues when a line appears twice", () => {
    const lines = [createLine({ id: 1, tags: [10] })];
    const linesPage = createLinesPage({
      sections: [
        { tag: 10, name: "A" },
        { tag: 11, name: "B" },
      ],
    });

    const issues = collectIssues(
      checkLinesPageNoDuplicateLines,
      linesPage,
      lines,
      { 10: [11] },
    );

    expectIssueMessages(issues, [
      'Line "Line" appears in multiple lines page sections: A, B.',
    ]);
  });

  it("ignores duplicates when configured", () => {
    const lines = [createLine({ id: 1, tags: [10] })];
    const linesPage = createLinesPage({
      sections: [
        { tag: 10, name: "A" },
        { tag: 10, name: "B" },
      ],
    });

    const issues = collectIssues(
      checkLinesPageNoDuplicateLines,
      linesPage,
      lines,
      {},
      { 1: { ignoreDuplicatedLine: true } },
    );

    expectIssueMessages(issues, []);
  });
});
