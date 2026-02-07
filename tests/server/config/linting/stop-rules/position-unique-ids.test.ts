import { describe, expect, it } from "vitest";
import { checkStopPositionsUniqueIds } from "../../../../../server/config/linting/stop-rules/position-unique-ids.js";
import type { StopConfig } from "../../../../../server/config/stop-config.js";

const createStop = (): StopConfig => ({
  id: 1,
  name: "Stop",
  tags: [],
  urlPath: "/stop",
  location: null,
  positions: [
    { stopPositionId: 1, name: "Platform 1" },
    { stopPositionId: 2, name: "Platform 2" },
  ],
});

describe("checkStopPositionsUniqueIds", () => {
  it("returns no issues for unique position IDs", () => {
    const stop = createStop();
    const issues = checkStopPositionsUniqueIds(stop, 0);
    expect(issues).toEqual([]);
  });

  it("returns issues for duplicate position IDs", () => {
    const stop = createStop();
    stop.positions[1].stopPositionId = 1;
    const issues = checkStopPositionsUniqueIds(stop, 0);
    expect(issues).toHaveLength(2);
    expect(issues[0].message).toContain("Position ID 1 is duplicated");
  });
});
