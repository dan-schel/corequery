import type { LintingCheck } from "../check.js";
import { consistentNamingCheck } from "./consistent-naming.js";
import { noDuplicateIdsCheck } from "./no-duplicate-ids.js";

export const linesCheck: LintingCheck = {
  scope: "lines",
  fn: (ctx) => {
    ctx.run(consistentNamingCheck);
    ctx.run(noDuplicateIdsCheck);
  },
};
