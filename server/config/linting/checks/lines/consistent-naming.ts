import type { LintingCheck } from "../check.js";

const defaultRegex = /^[A-Z][a-z]+( [A-Z][a-z]+)*$/;

export const consistentNamingCheck: LintingCheck = {
  scope: " - consistentNaming",
  fn: (ctx) => {
    const ignores = ctx.options.lines?.ignoreMisnamedLines ?? [];
    const regex = ctx.options.lines?.lineNameRegex ?? defaultRegex;

    for (const line of ctx.config.lines) {
      if (ignores.includes(line.id)) continue;

      if (!regex.test(line.name)) {
        ctx.report(`"${line.name}" is named inconsistently with other lines.`);
      }
    }
  },
};
