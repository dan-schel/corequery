import { describe, expect, it } from "vitest";
import { checkStopsUniqueNames } from "../../../../../server/config/linting/stop-rules/unique-names.js";
import type { StopConfig } from "../../../../../server/config/stop-config.js";

const createStop = (id: number, name: string): StopConfig => ({
  id,
  name,
  tags: [],
  urlPath: "/stop",
  location: null,
  positions: [],
});

describe("checkStopsUniqueNames", () => {
  it("returns no issues for unique names", () => {
    const stops = [createStop(1, "Stop A"), createStop(2, "Stop B")];
    const issues = checkStopsUniqueNames(stops);
    expect(issues).toEqual([]);
  });

  it("returns issues for duplicate names", () => {
    const stops = [createStop(1, "Stop A"), createStop(2, "Stop A")];
    const issues = checkStopsUniqueNames(stops);
    expect(issues).toHaveLength(2);
    expect(issues[0].message).toContain('Stop name "Stop A" is duplicated');
  });

  it("respects ignore option", () => {
    const stops = [createStop(1, "Stop A"), createStop(2, "Stop A")];
    const issues = checkStopsUniqueNames(stops, {
      1: { ignoreDuplicatedName: true },
    });
    expect(issues).toHaveLength(1);
  });
});
