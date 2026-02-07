import { describe, expect, it } from "vitest";
import { checkStopsAllOrNoneHaveLocations } from "../../../../../server/config/linting/stop/all-or-none-locations.js";
import { collectIssues } from "../support/collect-issues.js";
import { createStop } from "../support/factories.js";

describe("checkStopsAllOrNoneHaveLocations", () => {
  it("returns no issues when all are missing locations", () => {
    const issues = collectIssues(checkStopsAllOrNoneHaveLocations, [
      createStop({ id: 1, location: null }),
      createStop({ id: 2, location: null }),
    ]);

    expect(issues).toEqual([]);
  });

  it("returns issues when locations are mixed", () => {
    const issues = collectIssues(checkStopsAllOrNoneHaveLocations, [
      createStop({ id: 1, location: { latitude: 1, longitude: 2 } }),
      createStop({ id: 2, location: null }),
    ]);

    expect(issues).toHaveLength(1);
  });

  it("ignores missing locations when configured", () => {
    const issues = collectIssues(
      checkStopsAllOrNoneHaveLocations,
      [
        createStop({ id: 1, location: { latitude: 1, longitude: 2 } }),
        createStop({ id: 2, location: null }),
      ],
      { 2: { ignoreMissingLocation: true } },
    );

    expect(issues).toEqual([]);
  });
});
