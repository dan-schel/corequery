import type { LineConfig } from "../../../types/line-config.js";
import type { LineLintOptions } from "../../types.js";
import { findDuplicates } from "../../utils/find-duplicates.js";
import { IssueCollector } from "../../utils/issue-collector.js";

export function checkLineRoutesUniqueNames(
  issues: IssueCollector,
  line: LineConfig,
  lineIndex: number,
  options?: LineLintOptions,
) {
  const duplicates = findDuplicates(line.routes, (route) => route.name);

  duplicates.forEach((indices, name) => {
    indices.forEach((index) => {
      const route = line.routes[index];
      if (!route || options?.routes?.[route.id]?.ignoreDuplicatedName) {
        return;
      }

      issues.add({
        message: `Route name "${name}" is duplicated in line "${line.name}"`,
        path: `lines[${lineIndex}].routes[${index}].name`,
      });
    });
  });
}
