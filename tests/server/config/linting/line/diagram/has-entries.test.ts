import { describe, it } from "vitest";
import { checkLineDiagramHasEntries } from "../../../../../../server/config/linting/line/diagram/has-entries.js";
import { collectIssues } from "../../support/collect-issues.js";
import { expectIssueMessages } from "../../support/expect-issues.js";
import { createLine } from "../../support/factories.js";

describe("checkLineDiagramHasEntries", () => {
  it("returns no issues when entries exist", () => {
    const line = createLine({
      diagram: { entries: [{ name: null, color: "red", stops: [] }] },
    });
    const issues = collectIssues(checkLineDiagramHasEntries, line, 0);

    expectIssueMessages(issues, []);
  });

  it("returns issues when no entries exist", () => {
    const line = createLine({ diagram: { entries: [] } });
    const issues = collectIssues(checkLineDiagramHasEntries, line, 0);

    expectIssueMessages(issues, ['Line "Line" has no diagram entries.']);
  });

  it("ignores missing entries when configured", () => {
    const line = createLine({ diagram: { entries: [] } });
    const issues = collectIssues(checkLineDiagramHasEntries, line, 0, {
      ignoreMissingDiagramEntries: true,
    });

    expectIssueMessages(issues, []);
  });
});
