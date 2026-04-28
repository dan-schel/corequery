import type { ComponentChildren } from "preact";

export type StopStructure = {
  readonly content: ComponentChildren;
  readonly drawMark?: boolean;
  readonly getOverriddenMarkYPosition?: (contentDiv: HTMLElement) => number;
};

export type LinearStopDiagramStructure = {
  readonly type: "linear";
  readonly stops: readonly StopStructure[];
};

export type BranchStopDiagramStructure = {
  readonly type: "branch";
  readonly commonStops: readonly StopStructure[];
  readonly branchAStops: readonly StopStructure[];
  readonly branchBStops: readonly StopStructure[];
};

export type LoopStopDiagramStructure = {
  readonly type: "loop";
  readonly loopLeftStops: readonly StopStructure[];
  readonly loopRightStops: readonly StopStructure[];
  readonly mainStops: readonly StopStructure[];
};

export type QuasilinearStopDiagramStructure =
  | LinearStopDiagramStructure
  | BranchStopDiagramStructure
  | LoopStopDiagramStructure;
