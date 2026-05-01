import type { StopStructure } from "@/web/components/map-diagram/base/types";

export type LoopMapDiagramStructure = {
  readonly type: "loop";
  readonly loopLeftStops: readonly StopStructure[];
  readonly loopRightStops: readonly StopStructure[];
  readonly mainStops: readonly StopStructure[];
};
