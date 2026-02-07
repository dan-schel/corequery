import { describe, expect, it } from "vitest";
import { checkLineDiagramEntriesMinimumStops } from "../../../../../../server/config/linting/line/diagram/diagram-entry-minimum-stops.js";
import { collectIssues } from "../../support/collect-issues.js";
import { createDiagramEntry, createLine } from "../../support/factories.js";

describe("checkLineDiagramEntriesMinimumStops", () => {
  it("returns no issues when entries have 2 stops", () => {
    const line = createLine({ diagram: { entries: [createDiagramEntry()] } });
    const issues = collectIssues(checkLineDiagramEntriesMinimumStops, line, 0);

    expect(issues).toEqual([]);
  });

  it("returns issues when an entry has fewer than 2 stops", () => {
    const line = createLine({
      diagram: {
        entries: [
          createDiagramEntry({ stops: [{ stopId: 1, type: "regular" }] }),
        ],
      },
    });
    const issues = collectIssues(checkLineDiagramEntriesMinimumStops, line, 0);

    expect(issues).toHaveLength(1);
  });
});
