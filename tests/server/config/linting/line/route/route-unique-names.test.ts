import { describe, it } from "vitest";
import { checkLineRoutesUniqueNames } from "../../../../../../server/config/linting/line/route/route-unique-names.js";
import { collectIssues } from "../../support/collect-issues.js";
import { expectIssueMessages } from "../../support/expect-issues.js";
import { createLine, createRoute } from "../../support/factories.js";

describe("checkLineRoutesUniqueNames", () => {
  it("returns no issues when route names are unique", () => {
    const line = createLine({
      routes: [
        createRoute({ id: 1, name: "A" }),
        createRoute({ id: 2, name: "B" }),
      ],
    });

    const issues = collectIssues(checkLineRoutesUniqueNames, line, 0);

    expectIssueMessages(issues, []);
  });

  it("returns issues for duplicate route names", () => {
    const line = createLine({
      routes: [
        createRoute({ id: 1, name: "A" }),
        createRoute({ id: 2, name: "A" }),
      ],
    });

    const issues = collectIssues(checkLineRoutesUniqueNames, line, 0);

    expectIssueMessages(issues, [
      'Route name "A" is duplicated in line "Line"',
      'Route name "A" is duplicated in line "Line"',
    ]);
  });

  it("ignores duplicates when configured", () => {
    const line = createLine({
      routes: [
        createRoute({ id: 1, name: "A" }),
        createRoute({ id: 2, name: "A" }),
      ],
    });

    const issues = collectIssues(checkLineRoutesUniqueNames, line, 0, {
      routes: {
        1: { ignoreDuplicatedName: true },
        2: { ignoreDuplicatedName: true },
      },
    });

    expectIssueMessages(issues, []);
  });
});
