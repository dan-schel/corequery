import type { PositionConfig } from "@/server/config/types/stop-config.js";

type StopPositionFields = {
  readonly id: number;
  readonly name: string;
};

export class StopPosition {
  readonly id: number;
  readonly name: string;

  constructor(fields: StopPositionFields) {
    this.id = fields.id;
    this.name = fields.name;
  }

  static buildAll(configs: readonly PositionConfig[]) {
    return configs.map((x) => StopPosition.build(x));
  }

  static build(config: PositionConfig) {
    return new StopPosition({
      id: config.stopPositionId,
      name: config.name,
    });
  }
}
