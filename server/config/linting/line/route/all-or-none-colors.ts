import type { LineConfig } from "@/server/config/types/line-config.js";
import type { LineLintOptions } from "@/server/config/linting/types.js";
import { findAllOrNoneViolations } from "@/server/config/linting/utils/find-all-or-none-violations.js";
import { IssueCollector } from "@/server/config/linting/utils/issue-collector.js";

export function checkLineRoutesAllOrNoneHaveColors(
  issues: IssueCollector,
  line: LineConfig,
  lineIndex: number,
  options: LineLintOptions,
) {
  const routesToCheck = line.routes.filter(
    (route) => !(options.routes?.[route.id]?.ignoreMissingColor ?? false),
  );

  const missingColors = findAllOrNoneViolations(
    routesToCheck,
    (route) => route.color !== null,
  );

  for (const { item: route, index } of missingColors ?? []) {
    issues.add({
      message: `Route "${route.name}" in line "${line.name}" is missing a color.`,
      path: `lines[${lineIndex}].routes[${index}].color`,
    });
  }
}
