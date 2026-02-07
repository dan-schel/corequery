import type { LineConfig } from "../../../line-config.js";
import { findDuplicates } from "../../utils/helpers.js";
import { IssueCollector } from "../../utils/issue-collector.js";

export function checkLineRoutesUniqueIds(
  issues: IssueCollector,
  line: LineConfig,
  lineIndex: number,
) {
  const duplicates = findDuplicates(line.routes, (route) => route.id);

  duplicates.forEach((indices, id) => {
    indices.forEach((index) => {
      issues.add({
        message: `Route ID ${id} is duplicated in line "${line.name}"`,
        path: `lines[${lineIndex}].routes[${index}].id`,
      });
    });
  });
}
