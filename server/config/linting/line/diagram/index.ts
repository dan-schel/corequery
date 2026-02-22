import type { LineConfig } from "@/server/config/types/line-config.js";
import type { LineLintOptions } from "@/server/config/linting/types.js";
import type { IssueCollector } from "@/server/config/linting/utils/issue-collector.js";
import { checkLineDiagramEntriesMinimumStops } from "@/server/config/linting/line/diagram/entry-minimum-stops.js";
import { checkLineDiagramHasEntries } from "@/server/config/linting/line/diagram/has-entries.js";
import { checkLineDiagramStopsExist } from "@/server/config/linting/line/diagram/stops-exist.js";
import { checkLineDiagramStopsInRoutes } from "@/server/config/linting/line/diagram/stops-in-routes.js";
import type { StopConfig } from "@/server/config/types/stop-config.js";

export function lintLineDiagramConfig(
  issues: IssueCollector,
  line: LineConfig,
  lineIndex: number,
  stops: readonly StopConfig[],
  options: LineLintOptions,
) {
  checkLineDiagramHasEntries(issues, line, lineIndex, options);
  checkLineDiagramEntriesMinimumStops(issues, line, lineIndex);
  checkLineDiagramStopsExist(issues, line, lineIndex, stops);
  checkLineDiagramStopsInRoutes(issues, line, lineIndex, options);
}
