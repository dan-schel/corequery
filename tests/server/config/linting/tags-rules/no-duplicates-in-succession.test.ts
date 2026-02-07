import { describe, expect, it } from "vitest";
import { checkTagsNoDuplicatesInSuccession } from "../../../../../server/config/linting/tags-rules/no-duplicates-in-succession.js";
import type { TagsConfig } from "../../../../../server/config/tags-config.js";

const createTagsConfig = (
  stopSuccession: Record<number, readonly number[]> = {},
  lineSuccession: Record<number, readonly number[]> = {},
  routeSuccession: Record<number, readonly number[]> = {},
): TagsConfig => ({
  stopTagSuccession: stopSuccession,
  lineTagSuccession: lineSuccession,
  routeTagSuccession: routeSuccession,
});

describe("checkTagsNoDuplicatesInSuccession", () => {
  it("returns no issues for unique tags in succession", () => {
    const tags = createTagsConfig({ 1: [1, 2, 3] });
    const issues = checkTagsNoDuplicatesInSuccession(tags);
    expect(issues).toEqual([]);
  });

  it("returns issues for duplicate tags in succession", () => {
    const tags = createTagsConfig({ 1: [1, 2, 1] });
    const issues = checkTagsNoDuplicatesInSuccession(tags);
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toContain("Tag 1 is duplicated");
  });

  it("checks all succession types", () => {
    const tags = createTagsConfig({ 1: [1, 1] }, { 2: [2, 2] }, { 3: [3, 3] });
    const issues = checkTagsNoDuplicatesInSuccession(tags);
    expect(issues).toHaveLength(3);
  });
});
