import { describe, expect, it } from "vitest";
import { checkStopNoDuplicateTags } from "../../../../../server/config/linting/stop-rules/no-duplicate-tags.js";
import { IssueCollector } from "../../../../../server/config/linting/utils/issue-collector.js";
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
    const collector = new IssueCollector();
    checkStopNoDuplicateTags(collector, stop, 0);
    const issues = collector.getIssues();
    expect(issues).toEqual([]);
  });

  it("returns issues for duplicate tags", () => {
    const stop = createStop([1, 2, 1]);
    const collector = new IssueCollector();
    checkStopNoDuplicateTags(collector, stop, 0);
    const issues = collector.getIssues();
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toContain("Tag 1 is duplicated");
  });
});
