import { describe, expect, it } from "vitest";
import { checkStopNoDuplicateTags } from "../../../../../server/config/linting/stop-rules/no-duplicate-tags.js";
import type { StopConfig } from "../../../../../server/config/stop-config.js";

const createStop = (tags: number[]): StopConfig => ({
  id: 1,
  name: "Stop",
  tags,
  urlPath: "/stop",
  location: null,
  positions: [],
});

describe("checkStopNoDuplicateTags", () => {
  it("returns no issues for unique tags", () => {
    const stop = createStop([1, 2, 3]);
    const issues = checkStopNoDuplicateTags(stop, 0);
    expect(issues).toEqual([]);
  });

  it("returns issues for duplicate tags", () => {
    const stop = createStop([1, 2, 1]);
    const issues = checkStopNoDuplicateTags(stop, 0);
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toContain("Tag 1 is duplicated");
  });
});
