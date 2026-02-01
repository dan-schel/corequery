import type { LintingCheck } from "../check.js";

export const noLinesMissingCheck: LintingCheck = {
  scope: " - noLinesMissing",
  fn: (ctx) => {
    const sections = ctx.config.linesPage.sections;
    const ignores = ctx.options.linesPage?.ignoreMissingLines ?? [];

    for (const line of ctx.foundationalData.lines.all()) {
      const isIgnored = ignores.includes(line.id);
      if (isIgnored) continue;

      const isAssignedToSection = sections.some((s) => line.tags.has(s.tag));
      if (!isAssignedToSection) {
        ctx.report(`${line.debugName} not present in any section.`);
      }
    }
  },
};
