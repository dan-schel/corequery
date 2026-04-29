import { describe, it } from "vitest";
import { checkLineDiagramEntriesMinimumStops } from "@/server/config/linting/line/diagram/entry-minimum-stops.js";
import { collectIssues } from "@/tests/server/config/linting/support/collect-issues.js";
import { expectIssueMessages } from "@/tests/server/config/linting/support/expect-issues.js";
import {
  createDiagramEntry,
  createLine,
} from "@/tests/server/config/linting/support/factories.js";

describe("checkLineDiagramEntriesMinimumStops", () => {
  it("returns no issues when entries have 2 stops", () => {
    const line = createLine({ diagram: { entries: [createDiagramEntry()] } });
    const issues = collectIssues(checkLineDiagramEntriesMinimumStops, line, 0);

    expectIssueMessages(issues, []);
  });

  it("returns issues when a linear entry has fewer than 2 stops", () => {
    const line = createLine({
      diagram: {
        entries: [
          createDiagramEntry({
            shape: { type: "linear", stops: [{ stopId: 1, type: "regular" }] },
          }),
        ],
      },
    });
    const issues = collectIssues(checkLineDiagramEntriesMinimumStops, line, 0);

    expectIssueMessages(issues, [
      'Diagram entry <Entry 1> in line "Line" has fewer than 2 stops in stops.',
    ]);
  });

  it("returns issues when a branch entry is missing stops in a branch arm", () => {
    const line = createLine({
      diagram: {
        entries: [
          createDiagramEntry({
            shape: {
              type: "branch",
              commonStops: [{ stopId: 1, type: "regular" }],
              branchAStops: [{ stopId: 2, type: "regular" }],
              branchBStops: [],
            },
          }),
        ],
      },
    });
    const issues = collectIssues(checkLineDiagramEntriesMinimumStops, line, 0);

    expectIssueMessages(issues, [
      'Diagram entry <Entry 1> in line "Line" has fewer than 1 stop in branchBStops.',
    ]);
  });

  it("returns issues when a loop entry has no main stops", () => {
    const line = createLine({
      diagram: {
        entries: [
          createDiagramEntry({
            shape: {
              type: "loop",
              loopLeftStops: [{ stopId: 1, type: "regular" }],
              loopRightStops: [],
              mainStops: [],
            },
          }),
        ],
      },
    });
    const issues = collectIssues(checkLineDiagramEntriesMinimumStops, line, 0);

    expectIssueMessages(issues, [
      'Diagram entry <Entry 1> in line "Line" has fewer than 1 stop in mainStops.',
    ]);
  });
});
