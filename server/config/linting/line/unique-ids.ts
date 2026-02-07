import type { LineConfig } from "../../line-config.js";
import { findDuplicates } from "../utils/helpers.js";
import { IssueCollector } from "../utils/issue-collector.js";

export function checkLinesUniqueIds(
  issues: IssueCollector,
  lines: readonly LineConfig[],
) {
  const duplicates = findDuplicates(lines, (line) => line.id);

  duplicates.forEach((indices, id) => {
    indices.forEach((index) => {
      issues.add({
        message: `Line ID ${id} is duplicated.`,
        path: `lines[${index}].id`,
      });
    });
  });
}
