import type { StopConfig } from "../../../stop-config.js";
import { findDuplicates } from "../../utils/helpers.js";
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

  duplicates.forEach((indices, id) => {
    indices.forEach((index) => {
      issues.add({
        message: `Position ID ${id} is duplicated in stop "${stop.name}"`,
        path: `stops[${stopIndex}].positions[${index}].stopPositionId`,
      });
    });
  });
}
