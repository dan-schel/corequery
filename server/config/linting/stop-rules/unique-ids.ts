import type { StopConfig } from "../../stop-config.js";
import { findDuplicates } from "../utils/helpers.js";
import { IssueCollector } from "../utils/issue-collector.js";

export function checkStopsUniqueIds(
  issues: IssueCollector,
  stops: readonly StopConfig[],
) {
  const duplicates = findDuplicates(stops, (stop) => stop.id);

  duplicates.forEach((indices, id) => {
    indices.forEach((index) => {
      issues.add({
        message: `Stop ID ${id} is duplicated`,
        path: `stops[${index}].id`,
      });
    });
  });
}
