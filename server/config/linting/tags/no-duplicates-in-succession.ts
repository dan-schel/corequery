import type { TagsConfig } from "../../tags-config.js";
import { IssueCollector } from "../utils/issue-collector.js";

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
  Object.entries(succession).forEach(([key, tags]) => {
    const seen = new Set<number>();
    tags.forEach((tag, index) => {
      if (seen.has(tag)) {
        issues.add({
          message: `Tag ${tag} is duplicated in succession for key ${key}`,
          path: `${path}[${key}][${index}]`,
        });
      }
      seen.add(tag);
    });
  });
}
