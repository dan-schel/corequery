import { describe, it } from "vitest";
import { noLinesDuplicatedCheck } from "../../../../../../server/config/linting/checks/lines-page/no-lines-duplicated.js";
import { expectIssue, expectNoIssue } from "../../support.js";
import {
  emptyLineConfig,
  emptyLintableConfig,
  emptyTagsConfig,
} from "../../../support.js";

describe("noLinesDuplicatedCheck", () => {
  it("passes if appropriate", () => {
    expectNoIssue({
      check: noLinesDuplicatedCheck,
      config: {
        ...emptyLintableConfig,
        lines: [{ ...emptyLineConfig, id: 1, name: "Line 1", tags: [10] }],
        linesPage: {
          sections: [{ name: "Some section", tag: 10 }],
        },
      },
    });
  });

  describe("line is tagged in multiple sections explicitly", () => {
    it("catches the issue", () => {
      expectIssue({
        check: noLinesDuplicatedCheck,
        config: {
          ...emptyLintableConfig,
          lines: [
            { ...emptyLineConfig, id: 1, name: "Line 1", tags: [10, 49] },
          ],
          linesPage: {
            sections: [
              { name: "First", tag: 49 },
              { name: "Second", tag: 10 },
            ],
          },
        },
        issue: {
          message: '"Line 1" (#1) listed in "First" and "Second".',
        },
      });
    });
  });

  describe("line is tagged in multiple sections via succession", () => {
    it("catches the issue", () => {
      expectIssue({
        check: noLinesDuplicatedCheck,
        config: {
          ...emptyLintableConfig,
          lines: [{ ...emptyLineConfig, id: 1, name: "Line 1", tags: [10] }],
          linesPage: {
            sections: [
              { name: "First", tag: 49 },
              { name: "Second", tag: 10 },
            ],
          },
          tags: {
            ...emptyTagsConfig,
            lineTagSuccession: { 10: [49] },
          },
        },
        issue: {
          message: '"Line 1" (#1) listed in "First" and "Second".',
        },
      });
    });
  });
});
