import type { LineConfig } from "../../../line-config.js";
import type { LintIssue } from "../../types.js";
import { createIssue } from "../../utils/helpers.js";

export function checkLineDiagramHasEntries(
  line: LineConfig,
  lineIndex: number,
): LintIssue[] {
  const issues: LintIssue[] = [];

  if (line.diagram.entries.length === 0) {
    issues.push(
      createIssue(
        `Line "${line.name}" has no diagram entries`,
        `lines[${lineIndex}].diagram.entries`,
      ),
    );
  }

  return issues;
}
