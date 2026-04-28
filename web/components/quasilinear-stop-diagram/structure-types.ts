import type { ComponentChildren } from "preact";

type StopStructure = {
  readonly content: ComponentChildren;
  readonly drawMark?:
    | boolean
    | { getMarkYPosition(contentPosition: DOMRect): number };
};

export type LinearStopDiagramStructure = {
  readonly type: "linear";
  readonly stops: readonly StopStructure[];
};

export type QuasilinearStopDiagramStructure = LinearStopDiagramStructure;
