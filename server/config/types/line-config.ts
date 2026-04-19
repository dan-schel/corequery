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

export type LineDiagramEntryConfig = {
  readonly name: string | null;
  readonly color: Color | null;

  // So far, line diagrams are limited to being linear sequences of stops.
  // This could be extended in the future to support branches, loops, etc.
  readonly stops: readonly {
    readonly stopId: number;
    readonly type: LineDiagramStopTypeConfig;
  }[];
};

export type LineDiagramConfig = {
  readonly entries: readonly LineDiagramEntryConfig[];
};
