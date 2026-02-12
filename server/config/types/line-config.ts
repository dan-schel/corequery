export type LineConfig = {
  readonly id: number;
  readonly name: string;
  readonly code: string | null;
  readonly tags: number[];
  readonly urlPath: string;
  readonly routes: readonly RouteConfig[];
  readonly diagram: LineDiagramConfig;
};

export type RouteConfig = {
  readonly id: number;
  readonly name: string;
  readonly tags: number[];

  readonly stops: readonly {
    readonly stopId: number;
    readonly type: "regular" | "hidden-unless-stopped-at";
  }[];

  readonly color: Color | null;
};

export type LineDiagramConfig = {
  readonly entries: {
    readonly name: string | null;
    readonly color: string;

    // So far, line diagrams are limited to being linear sequences of stops.
    // This could be extended in the future to support branches, loops, etc.
    readonly stops: readonly {
      readonly stopId: number;
      readonly type: "regular" | "always-express";
    }[];
  }[];
};

export type Color =
  | "red"
  | "yellow"
  | "green"
  | "cyan"
  | "blue"
  | "pink"
  | "purple"
  | "gray";
