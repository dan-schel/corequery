import { describe, expect, it } from "vitest";
import { checkLineHasRoutes } from "../../../../../server/config/linting/line/has-routes.js";
import { collectIssues } from "../support/collect-issues.js";
import { createLine, createRoute } from "../support/factories.js";

describe("checkLineHasRoutes", () => {
  it("returns no issues when routes exist", () => {
    const line = createLine({ routes: [createRoute()] });
    const issues = collectIssues(checkLineHasRoutes, line, 0);

    expect(issues).toEqual([]);
  });

  it("returns issues when routes are missing", () => {
    const line = createLine({ routes: [] });
    const issues = collectIssues(checkLineHasRoutes, line, 0);

    expect(issues).toHaveLength(1);
  });
});
