export type GetDefaultDepartureFeedsForStopConfig = (
  stopId: number,
) => DefaultDepartureFeedsConfig;

export type DefaultDepartureFeedsConfig = readonly DefaultDepartureFeedConfig[];

export type DefaultDepartureFeedConfig = {
  readonly name: string;
  readonly desiredCount: number;
  readonly filterExpression: string;
};
