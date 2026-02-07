import { describe, it } from "vitest";
import { checkLineNoDuplicateTags } from "../../../../../server/config/linting/line/no-duplicate-tags.js";
import { collectIssues } from "../support/collect-issues.js";
import { expectIssueMessages } from "../support/expect-issues.js";
import { createLine } from "../support/factories.js";

describe("checkLineNoDuplicateTags", () => {
  it("returns no issues when tags are unique", () => {
    const line = createLine({ tags: [1, 2, 3] });
    const issues = collectIssues(checkLineNoDuplicateTags, line, 0);

    expectIssueMessages(issues, []);
  });

  it("returns issues when tags are duplicated", () => {
    const line = createLine({ tags: [1, 2, 1] });
    const issues = collectIssues(checkLineNoDuplicateTags, line, 0);

    expectIssueMessages(issues, ['Tag 1 is duplicated in line "Line"']);
  });
});
