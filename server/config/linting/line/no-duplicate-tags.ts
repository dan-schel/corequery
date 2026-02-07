import type { LineConfig } from "../../line-config.js";
import { findDuplicates } from "../utils/helpers.js";
import { IssueCollector } from "../utils/issue-collector.js";

export function checkLineNoDuplicateTags(
  issues: IssueCollector,
  line: LineConfig,
  lineIndex: number,
) {
  const duplicates = findDuplicates(line.tags, (tag) => tag);

  duplicates.forEach((indices, tag) => {
    indices.forEach((index) => {
      issues.add({
        message: `Tag ${tag} is duplicated in line "${line.name}".`,
        path: `lines[${lineIndex}].tags[${index}]`,
      });
    });
  });
}
