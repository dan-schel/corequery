import { describe, it } from "vitest";
import { checkLineHasRoutes } from "@/server/config/linting/line/has-routes.js";
import { collectIssues } from "@/tests/server/config/linting/support/collect-issues.js";
import { expectIssueMessages } from "@/tests/server/config/linting/support/expect-issues.js";
import {
  createLine,
  createRoute,
} from "@/tests/server/config/linting/support/factories.js";

describe("checkLineHasRoutes", () => {
  it("returns no issues when routes exist", () => {
    const line = createLine({ routes: [createRoute()] });
    const issues = collectIssues(checkLineHasRoutes, line, 0, {});

    expectIssueMessages(issues, []);
  });

  it("returns issues when routes are missing", () => {
    const line = createLine({ routes: [] });
    const issues = collectIssues(checkLineHasRoutes, line, 0, {});

    expectIssueMessages(issues, ['Line "Line" has no routes.']);
  });

  it("ignores missing routes when configured", () => {
    const line = createLine({ routes: [] });
    const issues = collectIssues(checkLineHasRoutes, line, 0, {
      ignoreMissingRoutes: true,
    });

    expectIssueMessages(issues, []);
  });
});
