import type { Color } from "@/server/data/color.js";

export type RouteStopTypeConfig = "regular" | "hidden-unless-stopped-at";
export type LineDiagramStopTypeConfig = "regular" | "always-express";

export type LineConfig = {
  readonly id: number;
  readonly name: string;
  readonly code: string | null;
  readonly tags: number[];
  readonly urlPath: string;
  readonly routes: readonly RouteConfig[];
  readonly diagram: LineDiagramConfig;
  readonly color: Color | null;
};

export type RouteConfig = {
  readonly id: number;
  readonly name: string;
  readonly tags: number[];

  readonly stops: readonly {
    readonly stopId: number;
    readonly type: RouteStopTypeConfig;
  }[];

  readonly color: Color | null;
};

export type LineDiagramConfig = {
  readonly entries: readonly LineDiagramEntryConfig[];
};

export type LineDiagramEntryConfig = {
  readonly name: string | null;
  readonly color: Color | null;
  readonly shape: LineDiagramShapeConfig;
};

export type LineDiagramShapeConfig =
  | LinearLineDiagramShapeConfig
  | BranchLineDiagramShapeConfig
  | LoopLineDiagramShapeConfig;

export type LinearLineDiagramShapeConfig = {
  type: "linear";
  stops: readonly LineDiagramStopConfig[];
};

export type BranchLineDiagramShapeConfig = {
  readonly type: "branch";
  readonly commonStops: readonly LineDiagramStopConfig[];
  readonly branchAStops: readonly LineDiagramStopConfig[];
  readonly branchBStops: readonly LineDiagramStopConfig[];
};

export type LoopLineDiagramShapeConfig = {
  readonly type: "loop";
  readonly loopLeftStops: readonly LineDiagramStopConfig[];
  readonly loopRightStops: readonly LineDiagramStopConfig[];
  readonly mainStops: readonly LineDiagramStopConfig[];
};

export type LineDiagramStopConfig = {
  readonly stopId: number;
  readonly type: LineDiagramStopTypeConfig;
};
