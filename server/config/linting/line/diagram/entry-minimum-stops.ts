import type { LineConfig } from "@/server/config/types/line-config.js";
import { chooseNameForEntry } from "@/server/config/linting/utils/choose-name-for-entry.js";
import { IssueCollector } from "@/server/config/linting/utils/issue-collector.js";
import { assertNever } from "@dan-schel/js-utils";

export function checkLineDiagramEntriesMinimumStops(
  issues: IssueCollector,
  line: LineConfig,
  lineIndex: number,
) {
  for (const [entryIndex, entry] of line.diagram.entries.entries()) {
    const entryName = chooseNameForEntry(entry.name, entryIndex);

    function addIssueUnlessLengthIs(
      minimum: number,
      array: readonly unknown[],
      arrayName: string,
    ) {
      if (array.length < minimum) {
        issues.add({
          message: `Diagram entry ${entryName} in line "${line.name}" has fewer than ${minimum} ${minimum === 1 ? "stop" : "stops"} in ${arrayName}.`,
          path: `lines[${lineIndex}].diagram.entries[${entryIndex}].${arrayName}`,
        });
      }
    }

    if (entry.shape.type === "linear") {
      addIssueUnlessLengthIs(2, entry.shape.stops, "stops");
    } else if (entry.shape.type === "branch") {
      addIssueUnlessLengthIs(1, entry.shape.commonStops, "commonStops");
      addIssueUnlessLengthIs(1, entry.shape.branchAStops, "branchAStops");
      addIssueUnlessLengthIs(1, entry.shape.branchBStops, "branchBStops");
    } else if (entry.shape.type === "loop") {
      const loopStops = [
        ...entry.shape.loopLeftStops,
        ...entry.shape.loopRightStops,
      ];
      addIssueUnlessLengthIs(
        1,
        loopStops,
        "loopLeftStops and loopRightStops combined",
      );
      addIssueUnlessLengthIs(1, entry.shape.mainStops, "mainStops");
    } else {
      assertNever(entry.shape);
    }
  }
}
