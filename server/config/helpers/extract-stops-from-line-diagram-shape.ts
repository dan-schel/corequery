import type { LineDiagramShapeConfig } from "@/server/config/types/line-config.js";
import { assertNever } from "@dan-schel/js-utils";

export function extractStopsFromLineDiagramShape(
  shape: LineDiagramShapeConfig,
) {
  if (shape.type === "linear") {
    return shape.stops;
  } else if (shape.type === "branch") {
    return [...shape.commonStops, ...shape.branchAStops, ...shape.branchBStops];
  } else if (shape.type === "loop") {
    return [
      ...shape.loopLeftStops,
      ...shape.loopRightStops,
      ...shape.mainStops,
    ];
  } else {
    assertNever(shape);
  }
}
