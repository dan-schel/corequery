import type { StopConfig } from "../../../stop-config.js";
import { findDuplicates } from "../../utils/find-duplicates.js";
import { IssueCollector } from "../../utils/issue-collector.js";

export function checkStopPositionsUniqueIds(
  issues: IssueCollector,
  stop: StopConfig,
  stopIndex: number,
) {
  const duplicates = findDuplicates(
    stop.positions,
    (position) => position.stopPositionId,
  );

  for (const [id, indices] of duplicates) {
    for (const index of indices) {
      issues.add({
        message: `Position ID ${id} is duplicated in stop "${stop.name}".`,
        path: `stops[${stopIndex}].positions[${index}].stopPositionId`,
      });
    }
  }
}
