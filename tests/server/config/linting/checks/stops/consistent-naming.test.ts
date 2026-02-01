import { describe, it } from "vitest";
import { consistentNamingCheck } from "../../../../../../server/config/linting/checks/stops/consistent-naming.js";
import { expectIssue, expectNoIssue } from "../../support.js";
import { emptyStopConfig, emptyLintableConfig } from "../../../support.js";

describe("consistentNaming", () => {
  it("passes if appropriate", () => {
    expectNoIssue({
      check: consistentNamingCheck,
      config: {
        ...emptyLintableConfig,
        stops: [
          { ...emptyStopConfig, id: 1, name: "The Stop" },
          { ...emptyStopConfig, id: 2, name: "Something" },
        ],
      },
    });
  });

  it("catches the issue", () => {
    expectIssue({
      check: consistentNamingCheck,
      config: {
        ...emptyLintableConfig,
        stops: [{ ...emptyStopConfig, id: 1, name: "asdf" }],
      },
      issue: {
        message: '"asdf" is named inconsistently with other stops.',
      },
    });
  });
});
