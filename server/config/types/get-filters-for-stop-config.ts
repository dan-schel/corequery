export type GetDepartureFiltersForStopConfig = (
  stopId: number,
) => DepartureFiltersConfig;

export type DepartureFiltersConfig = {
  readonly lines: "off" | "canonical" | readonly number[];
  readonly positions: "off" | "all" | readonly number[];
  readonly customGroups: readonly CustomFilterGroupConfig[];
};

export type CustomFilterGroupConfig = {
  readonly label: string;
  readonly items: readonly CustomFilterConfig[];
};

export type CustomFilterConfig = {
  readonly name: string;
  readonly labelWithinGroup: string;
  readonly filterExpression: string;
};
