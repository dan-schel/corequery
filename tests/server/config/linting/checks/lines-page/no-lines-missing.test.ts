import { describe, it } from "vitest";
import { noLinesMissingCheck } from "../../../../../../server/config/linting/checks/lines-page/no-lines-missing.js";
import { expectIssue, expectNoIssue } from "../../support.js";
import { emptyLineConfig, emptyLintableConfig } from "../../../support.js";

describe("noLinesMissingCheck", () => {
  it("passes if appropriate", () => {
    expectNoIssue({
      check: noLinesMissingCheck,
      config: {
        ...emptyLintableConfig,
        lines: [{ ...emptyLineConfig, id: 1, name: "Line 1", tags: [10] }],
        linesPage: {
          sections: [{ name: "Some section", tag: 10 }],
        },
      },
    });
  });

  it("catches the issue", () => {
    expectIssue({
      check: noLinesMissingCheck,
      config: {
        ...emptyLintableConfig,
        lines: [{ ...emptyLineConfig, id: 1, name: "Line 1", tags: [] }],
        linesPage: {
          sections: [{ name: "Some section", tag: 49 }],
        },
      },
      issue: {
        message: '"Line 1" (#1) not present in any section.',
      },
    });
  });
});
