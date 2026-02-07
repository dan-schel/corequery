import type { StopConfig } from "../../stop-config.js";
import type { StopLintOptions } from "../types.js";
import { findDuplicates } from "../utils/find-duplicates.js";
import { IssueCollector } from "../utils/issue-collector.js";

export function checkStopsUniqueNames(
  issues: IssueCollector,
  stops: readonly StopConfig[],
  options?: Record<number, StopLintOptions>,
) {
  const duplicates = findDuplicates(stops, (stop) => stop.name);

  duplicates.forEach((indices, name) => {
    indices.forEach((index) => {
      const stop = stops[index];
      if (!stop || options?.[stop.id]?.ignoreDuplicatedName) {
        return;
      }

      issues.add({
        message: `Stop name "${name}" is duplicated.`,
        path: `stops[${index}].name`,
      });
    });
  });
}
