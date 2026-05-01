import type { StopStructure } from "@/web/components/map-diagram/base/types";

export type BranchMapDiagramStructure = {
  readonly type: "branch";
  readonly commonStops: readonly StopStructure[];
  readonly branchAStops: readonly StopStructure[];
  readonly branchBStops: readonly StopStructure[];
};
