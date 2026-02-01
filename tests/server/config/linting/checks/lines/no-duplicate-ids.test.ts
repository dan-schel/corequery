import { describe, it } from "vitest";
import { noDuplicateIdsCheck } from "../../../../../../server/config/linting/checks/lines/no-duplicate-ids.js";
import { expectIssue, expectNoIssue } from "../../support.js";
import { emptyLineConfig, emptyLintableConfig } from "../../../support.js";

describe("noDuplicateIds", () => {
  it("passes if appropriate", () => {
    expectNoIssue({
      check: noDuplicateIdsCheck,
      config: {
        ...emptyLintableConfig,
        lines: [{ ...emptyLineConfig, id: 1, name: "Line 1" }],
      },
    });
  });

  it("catches the issue", () => {
    expectIssue({
      check: noDuplicateIdsCheck,
      config: {
        ...emptyLintableConfig,
        lines: [
          { ...emptyLineConfig, id: 1, name: "Line 1" },
          { ...emptyLineConfig, id: 1, name: "Line 2" },
        ],
      },
      issue: {
        message: 'Lines "Line 1" and "Line 2" share the same ID (#1).',
      },
    });
  });
});
