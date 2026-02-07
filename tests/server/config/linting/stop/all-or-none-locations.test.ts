import { describe, it } from "vitest";
import { checkStopsAllOrNoneHaveLocations } from "@/server/config/linting/stop/all-or-none-locations.js";
import { collectIssues } from "@/tests/server/config/linting/support/collect-issues.js";
import { expectIssueMessages } from "@/tests/server/config/linting/support/expect-issues.js";
import { createStop } from "@/tests/server/config/linting/support/factories.js";

describe("checkStopsAllOrNoneHaveLocations", () => {
  it("returns no issues when all are missing locations", () => {
    const issues = collectIssues(checkStopsAllOrNoneHaveLocations, [
      createStop({ id: 1, location: null }),
      createStop({ id: 2, location: null }),
    ]);

    expectIssueMessages(issues, []);
  });

  it("returns issues when locations are mixed", () => {
    const issues = collectIssues(checkStopsAllOrNoneHaveLocations, [
      createStop({ id: 1, location: { latitude: 1, longitude: 2 } }),
      createStop({ id: 2, location: null }),
    ]);

    expectIssueMessages(issues, ['Stop "Stop" is missing a location.']);
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

    expectIssueMessages(issues, []);
  });
});
