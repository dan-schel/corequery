import type { LintingCheck } from "../check.js";
import { consistentNamingCheck } from "./consistent-naming.js";
import { noDuplicateIdsCheck } from "./no-duplicate-ids.js";

export const stopsCheck: LintingCheck = {
  scope: "stops",
  fn: (ctx) => {
    ctx.run(consistentNamingCheck);
    ctx.run(noDuplicateIdsCheck);
  },
};
