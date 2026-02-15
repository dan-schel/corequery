import type { LineConfig } from "@/server/config/types/line-config.js";
import type { LineLintOptions } from "@/server/config/linting/types.js";
import { IssueCollector } from "@/server/config/linting/utils/issue-collector.js";

export function checkLineDiagramHasEntries(
  issues: IssueCollector,
  line: LineConfig,
  lineIndex: number,
  options?: LineLintOptions,
) {
  if (options?.ignoreMissingDiagramEntries ?? false) return;

  if (line.diagram.entries.length === 0) {
    issues.add({
      message: `Line "${line.name}" has no diagram entries.`,
      path: `lines[${lineIndex}].diagram.entries`,
    });
  }
}
