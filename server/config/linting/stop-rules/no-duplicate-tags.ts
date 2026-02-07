import type { StopConfig } from "../../stop-config.js";
import type { LintIssue } from "../types.js";
import { createIssue } from "../utils/helpers.js";

export function checkStopNoDuplicateTags(
  stop: StopConfig,
  stopIndex: number,
): LintIssue[] {
  const issues: LintIssue[] = [];
  const seen = new Set<number>();

  stop.tags.forEach((tag, tagIndex) => {
    if (seen.has(tag)) {
      issues.push(
        createIssue(
          `Tag ${tag} is duplicated in stop "${stop.name}"`,
          `stops[${stopIndex}].tags[${tagIndex}]`,
        ),
      );
    }
    seen.add(tag);
  });

  return issues;
}
