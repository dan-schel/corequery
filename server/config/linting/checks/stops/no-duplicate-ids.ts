import { listifyAnd } from "@dan-schel/js-utils";
import type { StopConfig } from "../../../types/stop-config.js";
import type { LintingCheck } from "../check.js";

export const noDuplicateIdsCheck: LintingCheck = {
  scope: " - noDuplicateIds",
  fn: (ctx) => {
    const idMapping = new Map<number, StopConfig[]>();
    for (const stop of ctx.config.stops) {
      const existing = idMapping.get(stop.id) ?? [];
      existing.push(stop);
      idMapping.set(stop.id, existing);
    }

    for (const [id, stops] of idMapping) {
      if (stops.length < 2) continue;

      const stopNames = listifyAnd(stops.map((l) => `"${l.name}"`));
      ctx.report(`Stops ${stopNames} share the same ID (#${id}).`);
    }
  },
};
