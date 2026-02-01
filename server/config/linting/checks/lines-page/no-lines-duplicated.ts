import { listifyAnd } from "@dan-schel/js-utils";
import type { LintingCheck } from "../check.js";

export const noLinesDuplicatedCheck: LintingCheck = {
  scope: " - noLinesDuplicated",
  fn: (ctx) => {
    const sections = ctx.config.linesPage.sections;
    const ignores = ctx.options.linesPage?.ignoreDuplicatedLines ?? [];

    for (const line of ctx.foundationalData.lines.all()) {
      const isIgnored = ignores.includes(line.id);
      if (isIgnored) continue;

      const assignedSections = sections.filter((s) => line.tags.has(s.tag));
      if (assignedSections.length < 2) continue;

      const sectionNames = assignedSections.map((s) => `"${s.name}"`);
      ctx.report(`${line.debugName} listed in ${listifyAnd(sectionNames)}.`);
    }
  },
};
