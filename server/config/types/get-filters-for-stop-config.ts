export type GetFiltersForStopConfig = (stopId: number) => {
  readonly defaultDepartureFeeds: DefaultDepartureFeedConfig;
  readonly availableFilters: AvailableFiltersConfig;
};

export type DefaultDepartureFeedConfig = {
  readonly desiredCount: number;
  readonly filterTokens: readonly string[];
}[];

export type AvailableFiltersConfig = {
  readonly customGroups: readonly CustomFilterGroupConfig[];
};

export type CustomFilterGroupConfig = {
  readonly label: string;
  readonly items: readonly CustomFilterConfig[];
};

export type CustomFilterConfig = {
  readonly token: string;
  readonly name: string;
  readonly labelWithinGroup: string;
};
