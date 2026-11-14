export type GetDepartureFiltersForStopConfig = (
  stopId: number,
) => StopDepartureFiltersConfig;

export type StopDepartureFiltersConfig = {
  readonly lines: "off" | "canonical" | readonly number[];
  readonly positions: "off" | "all" | readonly number[];
  readonly customGroups: readonly CustomStopDepartureFilterGroupConfig[];
};

export type CustomStopDepartureFilterGroupConfig = {
  readonly label: string;
  readonly items: readonly CustomStopDepartureFilterConfig[];
};

export type CustomStopDepartureFilterConfig = {
  readonly name: string;
  readonly labelWithinGroup: string;
  readonly filterExpression: string;
};
