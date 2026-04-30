import type { ComponentChildren } from "preact";

export type StopStructure = {
  readonly content: ComponentChildren;
  readonly drawMark?: boolean;
  readonly getOverriddenMarkYPosition?: (contentDiv: HTMLElement) => number;
};

export type LinearStopDiagramStructure = {
  readonly type: "linear";
  readonly stops: readonly StopStructure[];

  // TODO: Allow setting a threshold for the faded out section.

  // TODO: Allow "Trains typically start from/continue to [other lines]" for
  // the Pakenham, Cranbourne, and Sunbury lines (and Sandringham, Werribee, and
  // Williamstown lines in future).
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
