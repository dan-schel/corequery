import type { LintingCheck } from "../check.js";

const defaultRegex = /^[A-Z][a-z]+( [A-Z][a-z]+)*$/;

export const consistentNamingCheck: LintingCheck = {
  scope: " - consistentNaming",
  fn: (ctx) => {
    const regex = ctx.options.stops?.stopNameRegex ?? defaultRegex;

    for (const stop of ctx.config.stops) {
      if (!regex.test(stop.name)) {
        ctx.report(`"${stop.name}" is named inconsistently with other stops.`);
      }
    }
  },
};
