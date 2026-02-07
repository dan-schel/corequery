export type StopConfig = {
  readonly id: number;
  readonly name: string;
  readonly tags: number[];
  readonly urlPath: string;

  readonly location: {
    readonly latitude: number;
    readonly longitude: number;
  } | null;

  /** Positions within in stop, i.e. platforms, bays, wharfs, etc. */
  readonly positions: readonly PositionConfig[];
};

export type PositionConfig = {
  readonly stopPositionId: number;
  readonly name: string;
};
