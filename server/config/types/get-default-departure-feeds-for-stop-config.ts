import type { Tags } from "@/server/data/tags.js";

export type GetDefaultDepartureFeedsForStopConfig = (
  stopId: number,
  stopTags: Tags,
) => StopDefaultDepartureFeedsConfig;

export type StopDefaultDepartureFeedsConfig =
  readonly StopDefaultDepartureFeedConfig[];

export type StopDefaultDepartureFeedConfig = {
  readonly name: string;
  readonly desiredCount: number;
  readonly filterExpression: string;
};
