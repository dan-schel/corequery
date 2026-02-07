import { describe, expect, it } from "vitest";
import { checkLinesPageAllLinesListed } from "../../../../../server/config/linting/lines-page/all-lines-listed.js";
import { collectIssues } from "../support/collect-issues.js";
import { createLine, createLinesPage } from "../support/factories.js";

describe("checkLinesPageAllLinesListed", () => {
  it("returns no issues when all lines are listed", () => {
    const lines = [createLine({ id: 1, tags: [10] })];
    const linesPage = createLinesPage({ sections: [{ tag: 10, name: "A" }] });

    const issues = collectIssues(
      checkLinesPageAllLinesListed,
      linesPage,
      lines,
    );

    expect(issues).toEqual([]);
  });

  it("returns issues when a line is unlisted", () => {
    const lines = [createLine({ id: 1, tags: [10] }), createLine({ id: 2 })];
    const linesPage = createLinesPage({ sections: [{ tag: 10, name: "A" }] });

    const issues = collectIssues(
      checkLinesPageAllLinesListed,
      linesPage,
      lines,
    );

    expect(issues).toHaveLength(1);
  });

  it("ignores unlisted lines when configured", () => {
    const lines = [createLine({ id: 1, tags: [10] }), createLine({ id: 2 })];
    const linesPage = createLinesPage({ sections: [{ tag: 10, name: "A" }] });

    const issues = collectIssues(
      checkLinesPageAllLinesListed,
      linesPage,
      lines,
      { ignoreUnlistedLine: true },
    );

    expect(issues).toEqual([]);
  });
});
