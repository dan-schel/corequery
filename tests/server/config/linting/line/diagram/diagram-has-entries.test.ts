import { describe, expect, it } from "vitest";
import { checkLineDiagramHasEntries } from "../../../../../../server/config/linting/line/diagram/diagram-has-entries.js";
import { collectIssues } from "../../support/collect-issues.js";
import { createLine } from "../../support/factories.js";

describe("checkLineDiagramHasEntries", () => {
  it("returns no issues when entries exist", () => {
    const line = createLine({
      diagram: { entries: [{ name: null, color: "red", stops: [] }] },
    });
    const issues = collectIssues(checkLineDiagramHasEntries, line, 0);

    expect(issues).toEqual([]);
  });

  it("returns issues when no entries exist", () => {
    const line = createLine({ diagram: { entries: [] } });
    const issues = collectIssues(checkLineDiagramHasEntries, line, 0);

    expect(issues).toHaveLength(1);
  });
});
