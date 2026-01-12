export type StopConfig = {
  readonly id: number;
  readonly name: string;
  readonly tags: string[];
  readonly urlPath: string;

  readonly location: {
    readonly latitude: number;
    readonly longitude: number;
  } | null;

  /** Positions within in stop, i.e. platforms, bays, wharfs, etc. */
  readonly positions: readonly {
    readonly stopPositionId: number;
    readonly name: string;
  }[];
};
