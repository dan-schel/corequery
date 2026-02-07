import type { LineConfig } from "../../../line-config.js";
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

  for (const [name, indices] of duplicates) {
    for (const index of indices) {
      const route = line.routes[index];
      if (!route || options?.routes?.[route.id]?.ignoreDuplicatedName) continue;

      issues.add({
        message: `Route name "${name}" is duplicated in line "${line.name}".`,
        path: `lines[${lineIndex}].routes[${index}].name`,
      });
    }
  }
}
