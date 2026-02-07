import type { StopConfig } from "../../stop-config.js";
import type { LintIssue, StopLintOptions } from "../types.js";
import { createIssue, findDuplicates } from "../utils/helpers.js";

export function checkStopsUniqueNames(
  stops: readonly StopConfig[],
  options?: Record<number, StopLintOptions>,
): LintIssue[] {
  const issues: LintIssue[] = [];
  const duplicates = findDuplicates(stops, (stop) => stop.name);

  duplicates.forEach((indices, name) => {
    indices.forEach((index) => {
      const stop = stops[index];
      if (!stop || options?.[stop.id]?.ignoreDuplicatedName) {
        return;
      }

      issues.push(
        createIssue(
          `Stop name "${name}" is duplicated`,
          `stops[${index}].name`,
        ),
      );
    });
  });

  return issues;
}
