import { describe, it } from "vitest";
import { checkLinesPageAllLinesListed } from "@/server/config/linting/lines-page/all-lines-listed.js";
import { collectIssues } from "@/tests/server/config/linting/support/collect-issues.js";
import { expectIssueMessages } from "@/tests/server/config/linting/support/expect-issues.js";
import {
  createLine,
  createLinesPage,
} from "@/tests/server/config/linting/support/factories.js";

describe("checkLinesPageAllLinesListed", () => {
  it("returns no issues when all lines are listed", () => {
    const lines = [createLine({ id: 1, tags: [1] })];
    const linesPage = createLinesPage({ sections: [{ tag: 10, name: "A" }] });

    const issues = collectIssues(
      checkLinesPageAllLinesListed,
      linesPage,
      lines,
      { 1: [10] },
    );

    expectIssueMessages(issues, []);
  });

  it("returns issues when a line is unlisted", () => {
    const lines = [createLine({ id: 1, tags: [10] }), createLine({ id: 2 })];
    const linesPage = createLinesPage({ sections: [{ tag: 10, name: "A" }] });

    const issues = collectIssues(
      checkLinesPageAllLinesListed,
      linesPage,
      lines,
      {},
    );

    expectIssueMessages(issues, [
      'Line "Line" is not listed in any lines page section.',
    ]);
  });

  it("ignores unlisted lines when configured", () => {
    const lines = [createLine({ id: 1, tags: [10] }), createLine({ id: 2 })];
    const linesPage = createLinesPage({ sections: [{ tag: 10, name: "A" }] });

    const issues = collectIssues(
      checkLinesPageAllLinesListed,
      linesPage,
      lines,
      {},
      { 2: { ignoreUnlistedLine: true } },
    );

    expectIssueMessages(issues, []);
  });
});
