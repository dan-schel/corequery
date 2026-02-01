import { describe, it } from "vitest";
import { noDuplicateIdsCheck } from "../../../../../../server/config/linting/checks/stops/no-duplicate-ids.js";
import { expectIssue, expectNoIssue } from "../../support.js";
import { emptyStopConfig, emptyLintableConfig } from "../../../support.js";

describe("noDuplicateIds", () => {
  it("passes if appropriate", () => {
    expectNoIssue({
      check: noDuplicateIdsCheck,
      config: {
        ...emptyLintableConfig,
        stops: [{ ...emptyStopConfig, id: 1, name: "Stop 1" }],
      },
    });
  });

  it("catches the issue", () => {
    expectIssue({
      check: noDuplicateIdsCheck,
      config: {
        ...emptyLintableConfig,
        stops: [
          { ...emptyStopConfig, id: 1, name: "Stop 1" },
          { ...emptyStopConfig, id: 1, name: "Stop 2" },
        ],
      },
      issue: {
        message: 'Stops "Stop 1" and "Stop 2" share the same ID (#1).',
      },
    });
  });
});
