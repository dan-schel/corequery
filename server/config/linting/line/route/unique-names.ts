import type { LineConfig } from "@/server/config/types/line-config.js";
import type { LineLintOptions } from "@/server/config/linting/types.js";
import { findDuplicates } from "@/server/config/linting/utils/find-duplicates.js";
import { IssueCollector } from "@/server/config/linting/utils/issue-collector.js";
import { itsOk } from "@dan-schel/js-utils";

export function checkLineRoutesUniqueNames(
  issues: IssueCollector,
  line: LineConfig,
  lineIndex: number,
  options: LineLintOptions,
) {
  const duplicates = findDuplicates(line.routes, (route) => route.name);

  for (const [name, indices] of duplicates) {
    for (const index of indices) {
      const route = itsOk(line.routes[index]);
      if (options.routes?.[route.id]?.ignoreDuplicatedName ?? false) continue;

      issues.add({
        message: `Route name "${name}" is duplicated in line "${line.name}".`,
        path: `lines[${lineIndex}].routes[${index}].name`,
      });
    }
  }
}
