import { describe, expect, it } from "vitest";
import { checkStopsUniqueIds } from "../../../../../server/config/linting/stop/unique-ids.js";
import { IssueCollector } from "../../../../../server/config/linting/utils/issue-collector.js";
import type { StopConfig } from "../../../../../server/config/stop-config.js";

const createStop = (id: number): StopConfig => ({
  id,
  name: "Stop",
  tags: [],
  urlPath: "/stop",
  location: null,
  positions: [],
});

describe("checkStopsUniqueIds", () => {
  it("returns no issues for unique IDs", () => {
    const stops = [createStop(1), createStop(2)];
    const collector = new IssueCollector();
    checkStopsUniqueIds(collector, stops);
    const issues = collector.getIssues();
    expect(issues).toEqual([]);
  });

  it("returns issues for duplicate IDs", () => {
    const stops = [createStop(1), createStop(1)];
    const collector = new IssueCollector();
    checkStopsUniqueIds(collector, stops);
    const issues = collector.getIssues();
    expect(issues).toHaveLength(2);
    expect(issues[0].message).toContain("Stop ID 1 is duplicated");
    expect(issues[0].path).toBe("stops[0].id");
  });
});
