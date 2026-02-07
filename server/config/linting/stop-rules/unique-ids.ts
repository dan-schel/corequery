import type { StopConfig } from "../../stop-config.js";
import type { LintIssue } from "../types.js";
import { createIssue, findDuplicates } from "../utils/helpers.js";

export function checkStopsUniqueIds(stops: readonly StopConfig[]): LintIssue[] {
  const issues: LintIssue[] = [];
  const duplicates = findDuplicates(stops, (stop) => stop.id);

  duplicates.forEach((indices, id) => {
    indices.forEach((index) => {
      issues.push(
        createIssue(`Stop ID ${id} is duplicated`, `stops[${index}].id`),
      );
    });
  });

  return issues;
}
