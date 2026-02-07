import type { TagsConfig } from "../../types/tags-config.js";
import { IssueCollector } from "../utils/issue-collector.js";
import { findDuplicates } from "../utils/find-duplicates.js";

export function checkTagsNoDuplicatesInSuccession(
  issues: IssueCollector,
  tags: TagsConfig,
) {
  checkSuccessionNoDuplicates(
    issues,
    tags.stopTagSuccession,
    "tags.stopTagSuccession",
  );
  checkSuccessionNoDuplicates(
    issues,
    tags.lineTagSuccession,
    "tags.lineTagSuccession",
  );
  checkSuccessionNoDuplicates(
    issues,
    tags.routeTagSuccession,
    "tags.routeTagSuccession",
  );
}

function checkSuccessionNoDuplicates(
  issues: IssueCollector,
  succession: Record<number, readonly number[]>,
  path: string,
) {
  for (const [key, tags] of Object.entries(succession)) {
    const duplicates = findDuplicates(tags, (tag) => tag);

    for (const [tag, indices] of duplicates) {
      for (const index of indices) {
        issues.add({
          message: `Tag ${tag} is duplicated in succession for key ${key}.`,
          path: `${path}[${key}][${index}]`,
        });
      }
    }
  }
}
