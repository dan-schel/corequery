import type { LintingCheck } from "../check.js";

export const linesPageCheck: LintingCheck = {
  scope: "linesPage",
  fn: (ctx) => {
    ctx.report("Lines Page check executed.");
  },
};
