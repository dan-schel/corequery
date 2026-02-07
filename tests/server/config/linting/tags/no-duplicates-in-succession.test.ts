import { describe, expect, it } from "vitest";
import { checkTagsNoDuplicatesInSuccession } from "../../../../../server/config/linting/tags/no-duplicates-in-succession.js";
import { collectIssues } from "../support/collect-issues.js";
import { createTagsConfig } from "../support/factories.js";

describe("checkTagsNoDuplicatesInSuccession", () => {
  it("returns no issues when tags are unique", () => {
    const tags = createTagsConfig({ stopTagSuccession: { 1: [1, 2, 3] } });
    const issues = collectIssues(checkTagsNoDuplicatesInSuccession, tags);

    expect(issues).toEqual([]);
  });

  it("returns issues when tags are duplicated", () => {
    const tags = createTagsConfig({ stopTagSuccession: { 1: [1, 2, 1] } });
    const issues = collectIssues(checkTagsNoDuplicatesInSuccession, tags);

    expect(issues).toHaveLength(1);
  });
});
