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

export type QuasilinearStopDiagramStructure = LinearStopDiagramStructure;
