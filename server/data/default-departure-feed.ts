import type { DefaultDepartureFeedConfig } from "@/server/config/index.js";

type DefaultDepartureFeedFields = {
  readonly name: string;
  readonly desiredCount: number;
  readonly filterExpression: string;
};

export class DefaultDepartureFeed {
  readonly name: string;
  readonly desiredCount: number;
  readonly filterExpression: string;

  constructor(fields: DefaultDepartureFeedFields) {
    this.name = fields.name;
    this.desiredCount = fields.desiredCount;
    this.filterExpression = fields.filterExpression;
  }

  static buildAll(configs: readonly DefaultDepartureFeedConfig[]) {
    return configs.map((x) => DefaultDepartureFeed.build(x));
  }

  static build(config: DefaultDepartureFeedConfig) {
    return new DefaultDepartureFeed({
      name: config.name,
      desiredCount: config.desiredCount,
      filterExpression: config.filterExpression,
    });
  }
}
