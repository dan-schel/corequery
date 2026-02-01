import type { LintingCheck } from "../check.js";
import { noLinesDuplicatedCheck } from "./no-lines-duplicated.js";
import { noLinesMissingCheck } from "./no-lines-missing.js";

export const linesPageCheck: LintingCheck = {
  scope: "linesPage",
  fn: (ctx) => {
    // Don't need to check if any sections are provided. As long as there's
    // lines, those lines will be required to appear in sections.

    ctx.run(noLinesMissingCheck);
    ctx.run(noLinesDuplicatedCheck);
  },
};
