import { describe, it } from "vitest";
import { checkLineRouteNonEmptyName } from "../../../../../../server/config/linting/line/route/non-empty-name.js";
import { collectIssues } from "../../support/collect-issues.js";
import { expectIssueMessages } from "../../support/expect-issues.js";
import { createRoute } from "../../support/factories.js";

describe("checkLineRoutesNonEmptyNames", () => {
  it("returns no issues when route names are non-empty", () => {
    const route = createRoute({ id: 1, name: "A" });

    const issues = collectIssues(checkLineRouteNonEmptyName, route, 0, 0);

    expectIssueMessages(issues, []);
  });

  it("returns issues for empty route names", () => {
    const route = createRoute({ id: 1, name: "" });

    const issues = collectIssues(checkLineRouteNonEmptyName, route, 0, 0);

    expectIssueMessages(issues, ["Route name is empty."]);
  });
});
