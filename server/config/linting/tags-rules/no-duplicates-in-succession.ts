import type { TagsConfig } from "../../tags-config.js";
import type { LintIssue } from "../types.js";
import { createIssue } from "../utils/helpers.js";

function checkSuccessionNoDuplicates(
  succession: Record<number, readonly number[]>,
  path: string,
): LintIssue[] {
  const issues: LintIssue[] = [];

  Object.entries(succession).forEach(([key, tags]) => {
    const seen = new Set<number>();
    tags.forEach((tag, index) => {
      if (seen.has(tag)) {
        issues.push(
          createIssue(
            `Tag ${tag} is duplicated in succession for key ${key}`,
            `${path}[${key}][${index}]`,
          ),
        );
      }
      seen.add(tag);
    });
  });

  return issues;
}

export function checkTagsNoDuplicatesInSuccession(
  tags: TagsConfig,
): LintIssue[] {
  return [
    ...checkSuccessionNoDuplicates(
      tags.stopTagSuccession,
      "tags.stopTagSuccession",
    ),
    ...checkSuccessionNoDuplicates(
      tags.lineTagSuccession,
      "tags.lineTagSuccession",
    ),
    ...checkSuccessionNoDuplicates(
      tags.routeTagSuccession,
      "tags.routeTagSuccession",
    ),
  ];
}
