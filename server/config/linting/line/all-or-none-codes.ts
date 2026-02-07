import type { LineConfig } from "../../line-config.js";
import type { LineLintOptions } from "../types.js";
import { allOrNone } from "../utils/helpers.js";
import { IssueCollector } from "../utils/issue-collector.js";

export function checkLinesAllOrNoneHaveCodes(
  issues: IssueCollector,
  lines: readonly LineConfig[],
  options?: Record<number, LineLintOptions>,
) {
  const linesToCheck = lines.filter(
    (line) => !options?.[line.id]?.ignoreMissingCode,
  );

  const status = allOrNone(linesToCheck, (line) => line.code !== null);

  if (status === "mixed") {
    linesToCheck.forEach((line, index) => {
      if (line.code === null) {
        issues.add({
          message: `Line "${line.name}" is missing a code.`,
          path: `lines[${index}].code`,
        });
      }
    });
  }
}
