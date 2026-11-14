export type GetDefaultDepartureFeedsForStopConfig = (
  stopId: number,
) => StopDefaultDepartureFeedsConfig;

export type StopDefaultDepartureFeedsConfig =
  readonly StopDefaultDepartureFeedConfig[];

export type StopDefaultDepartureFeedConfig = {
  readonly name: string;
  readonly desiredCount: number;
  readonly filterExpression: string;
};
