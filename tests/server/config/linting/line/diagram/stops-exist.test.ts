import { describe, it } from "vitest";
import { checkLineDiagramStopsExist } from "@/server/config/linting/line/diagram/stops-exist.js";
import { collectIssues } from "@/tests/server/config/linting/support/collect-issues.js";
import { expectIssueMessages } from "@/tests/server/config/linting/support/expect-issues.js";
import {
  createLine,
  createStop,
} from "@/tests/server/config/linting/support/factories.js";

describe("checkLineDiagramStopsExist", () => {
  it("returns no issues when stops exist", () => {
    const line = createLine({
      diagram: {
        entries: [
          { name: null, color: "red", stops: [{ stopId: 1, type: "regular" }] },
        ],
      },
    });
    const stops = [createStop({ id: 1 })];
    const issues = collectIssues(checkLineDiagramStopsExist, line, 0, stops);

    expectIssueMessages(issues, []);
  });

  it("returns issues when a stop is missing", () => {
    const line = createLine({
      diagram: {
        entries: [
          { name: null, color: "red", stops: [{ stopId: 2, type: "regular" }] },
        ],
      },
    });
    const stops = [createStop({ id: 1 })];
    const issues = collectIssues(checkLineDiagramStopsExist, line, 0, stops);

    expectIssueMessages(issues, [
      'Stop ID 2 in diagram entry <Entry 1> of line "Line" does not exist in the stop list.',
    ]);
  });
});
