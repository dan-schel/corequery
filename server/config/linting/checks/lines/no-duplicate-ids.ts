import { listifyAnd } from "@dan-schel/js-utils";
import type { LineConfig } from "../../../types/line-config.js";
import type { LintingCheck } from "../check.js";

export const noDuplicateIdsCheck: LintingCheck = {
  scope: " - noDuplicateIds",
  fn: (ctx) => {
    const idMapping = new Map<number, LineConfig[]>();
    for (const line of ctx.config.lines) {
      const existing = idMapping.get(line.id) ?? [];
      existing.push(line);
      idMapping.set(line.id, existing);
    }

    for (const [id, lines] of idMapping) {
      if (lines.length < 2) continue;

      const lineNames = listifyAnd(lines.map((l) => `"${l.name}"`));
      ctx.report(`Lines ${lineNames} share the same ID (#${id}).`);
    }
  },
};
