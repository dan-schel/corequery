import type { LinesPageLineLintOptions } from "@/server/config/linting/types.js";
import type { IssueCollector } from "@/server/config/linting/utils/issue-collector.js";
import { checkLinesPageAllLinesListed } from "@/server/config/linting/lines-page/all-lines-listed.js";
import { checkLinesPageNoDuplicateLines } from "@/server/config/linting/lines-page/no-duplicate-lines.js";
import type { LinesPageConfig } from "@/server/config/types/lines-page-config.js";
import type { LineConfig } from "@/server/config/types/line-config.js";
import type { TagSuccessionConfig } from "@/server/config/types/tags-config.js";

export function lintLinesPageConfig(
  issues: IssueCollector,
  linesPage: LinesPageConfig,
  lines: readonly LineConfig[],
  lineTagSuccession: TagSuccessionConfig,
  options: Record<number, LinesPageLineLintOptions>,
): void {
  checkLinesPageAllLinesListed(
    issues,
    linesPage,
    lines,
    lineTagSuccession,
    options,
  );
  checkLinesPageNoDuplicateLines(
    issues,
    linesPage,
    lines,
    lineTagSuccession,
    options,
  );
}
