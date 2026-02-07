import { describe, it } from "vitest";
import { checkStopNoDuplicateTags } from "../../../../../server/config/linting/stop/no-duplicate-tags.js";
import { collectIssues } from "../support/collect-issues.js";
import { expectIssueMessages } from "../support/expect-issues.js";
import { createStop } from "../support/factories.js";

describe("checkStopNoDuplicateTags", () => {
  it("returns no issues when tags are unique", () => {
    const stop = createStop({ tags: [1, 2, 3] });
    const issues = collectIssues(checkStopNoDuplicateTags, stop, 0);

    expectIssueMessages(issues, []);
  });

  it("returns issues when tags are duplicated", () => {
    const stop = createStop({ tags: [1, 2, 1] });
    const issues = collectIssues(checkStopNoDuplicateTags, stop, 0);

    expectIssueMessages(issues, ['Tag 1 is duplicated in stop "Stop"']);
  });
});
