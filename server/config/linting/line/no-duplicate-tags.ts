import type { LineConfig } from "../../line-config.js";
import { IssueCollector } from "../utils/issue-collector.js";

export function checkLineNoDuplicateTags(
  issues: IssueCollector,
  line: LineConfig,
  lineIndex: number,
) {
  const seen = new Set<number>();

  line.tags.forEach((tag, tagIndex) => {
    if (seen.has(tag)) {
      issues.add({
        message: `Tag ${tag} is duplicated in line "${line.name}".`,
        path: `lines[${lineIndex}].tags[${tagIndex}]`,
      });
    }
    seen.add(tag);
  });
}
