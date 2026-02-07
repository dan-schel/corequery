import { describe, expect, it } from "vitest";
import { checkLinesUniqueIds } from "../../../../../server/config/linting/line-rules/unique-ids.js";
import type { LineConfig } from "../../../../../server/config/line-config.js";

const createLine = (id: number): LineConfig => ({
  id,
  name: "Line",
  code: null,
  tags: [],
  urlPath: "/line",
  routes: [],
  diagram: { entries: [] },
});

describe("checkLinesUniqueIds", () => {
  it("returns no issues for unique IDs", () => {
    const lines = [createLine(1), createLine(2)];
    const issues = checkLinesUniqueIds(lines);
    expect(issues).toEqual([]);
  });

  it("returns issues for duplicate IDs", () => {
    const lines = [createLine(1), createLine(1)];
    const issues = checkLinesUniqueIds(lines);
    expect(issues).toHaveLength(2);
    expect(issues[0].message).toContain("Line ID 1 is duplicated");
  });
});
