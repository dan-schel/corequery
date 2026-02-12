import { describe, it } from "vitest";
import { checkLineRoutesMirrored } from "@/server/config/linting/line/route/routes-mirrored.js";
import { collectIssues } from "@/tests/server/config/linting/support/collect-issues.js";
import { expectIssueMessages } from "@/tests/server/config/linting/support/expect-issues.js";
import {
  createLine,
  createRoute,
} from "@/tests/server/config/linting/support/factories.js";

describe("checkLineRoutesMirrored", () => {
  it("returns no issues when routes are mirrored", () => {
    const line = createLine({
      routes: [
        createRoute({
          id: 1,
          stops: [
            { stopId: 1, type: "regular" },
            { stopId: 2, type: "regular" },
          ],
        }),
        createRoute({
          id: 2,
          stops: [
            { stopId: 2, type: "regular" },
            { stopId: 1, type: "regular" },
          ],
        }),
      ],
    });

    const issues = collectIssues(checkLineRoutesMirrored, line, 0);

    expectIssueMessages(issues, []);
  });

  it("returns issues when no mirror exists", () => {
    const line = createLine({ routes: [createRoute({ id: 1 })] });
    const issues = collectIssues(checkLineRoutesMirrored, line, 0);

    expectIssueMessages(issues, [
      'Route "Route" in line "Line" does not have a mirrored route.',
    ]);
  });

  it("ignores missing mirrors when configured", () => {
    const line = createLine({ routes: [createRoute({ id: 1 })] });
    const issues = collectIssues(checkLineRoutesMirrored, line, 0, {
      routes: { 1: { ignoreMissingMirrored: true } },
    });

    expectIssueMessages(issues, []);
  });
});
