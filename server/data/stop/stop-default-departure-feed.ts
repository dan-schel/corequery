import type { StopDefaultDepartureFeedConfig } from "@/server/config/index.js";

type StopDefaultDepartureFeedFields = {
  readonly name: string;
  readonly desiredCount: number;
  readonly filterExpression: string;
};

export class StopDefaultDepartureFeed {
  readonly name: string;
  readonly desiredCount: number;
  readonly filterExpression: string;

  constructor(fields: StopDefaultDepartureFeedFields) {
    this.name = fields.name;
    this.desiredCount = fields.desiredCount;
    this.filterExpression = fields.filterExpression;
  }

  static buildAll(configs: readonly StopDefaultDepartureFeedConfig[]) {
    return configs.map((x) => StopDefaultDepartureFeed.build(x));
  }

  static build(config: StopDefaultDepartureFeedConfig) {
    return new StopDefaultDepartureFeed({
      name: config.name,
      desiredCount: config.desiredCount,
      filterExpression: config.filterExpression,
    });
  }
}
