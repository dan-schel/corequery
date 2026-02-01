import type { LintingCheck } from "../check.js";
import { noLinesDuplicatedCheck } from "./no-lines-duplicated.js";
import { noLinesMissingCheck } from "./no-lines-missing.js";

export const linesPageCheck: LintingCheck = {
  scope: "linesPage",
  fn: (ctx) => {
    ctx.run(noLinesMissingCheck);
    ctx.run(noLinesDuplicatedCheck);
  },
};
