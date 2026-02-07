import { describe, it } from "vitest";
import { checkRouteNoDuplicateTags } from "../../../../../../server/config/linting/line/route/route-no-duplicate-tags.js";
import { collectIssues } from "../../support/collect-issues.js";
import { expectIssueMessages } from "../../support/expect-issues.js";
import { createRoute } from "../../support/factories.js";

describe("checkRouteNoDuplicateTags", () => {
  it("returns no issues when tags are unique", () => {
    const route = createRoute({ tags: [1, 2, 3] });
    const issues = collectIssues(
      checkRouteNoDuplicateTags,
      route,
      0,
      0,
      "Line",
    );

    expectIssueMessages(issues, []);
  });

  it("returns issues when tags are duplicated", () => {
    const route = createRoute({ tags: [1, 2, 1] });
    const issues = collectIssues(
      checkRouteNoDuplicateTags,
      route,
      0,
      0,
      "Line",
    );

    expectIssueMessages(issues, [
      'Tag 1 is duplicated in route "Route" of line "Line".',
    ]);
  });
});
