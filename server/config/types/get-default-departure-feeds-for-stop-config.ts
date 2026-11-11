export type GetDefaultDepartureFeedsForStopConfig = (
  stopId: number,
) => readonly DefaultDepartureFeedConfig[];

export type DefaultDepartureFeedConfig = {
  readonly name: string;
  readonly desiredCount: number;
  readonly filterExpression: string;
};
