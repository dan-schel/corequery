import { describe, it } from "vitest";
import { consistentNamingCheck } from "../../../../../../server/config/linting/checks/lines/consistent-naming.js";
import { expectIssue, expectNoIssue } from "../../support.js";
import { emptyLineConfig, emptyLintableConfig } from "../../../support.js";

describe("consistentNaming", () => {
  it("passes if appropriate", () => {
    expectNoIssue({
      check: consistentNamingCheck,
      config: {
        ...emptyLintableConfig,
        lines: [
          { ...emptyLineConfig, id: 1, name: "The Line" },
          { ...emptyLineConfig, id: 2, name: "Something" },
        ],
      },
    });
  });

  it("catches the issue", () => {
    expectIssue({
      check: consistentNamingCheck,
      config: {
        ...emptyLintableConfig,
        lines: [{ ...emptyLineConfig, id: 1, name: "asdf" }],
      },
      issue: {
        message: '"asdf" is named inconsistently with other lines.',
      },
    });
  });
});
