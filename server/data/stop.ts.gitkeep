import type { StopConfig } from "../config/stop-config.js";

// For example purposes only. This is how we might implement a Stop class, which
// allows us to define methods and encapsulate logic related to stops.

export class Stop {
  readonly id: number;
  readonly name: string;
  readonly tags: string[];
  readonly urlPath: string;

  // These would probably be their own classes in a full implementation.
  readonly location: StopConfig["location"];
  readonly positions: StopConfig["positions"];

  constructor(config: StopConfig) {
    this.id = config.id;
    this.name = config.name;
    this.tags = config.tags;
    this.urlPath = config.urlPath;
    this.location = config.location;
    this.positions = config.positions;
  }

  with(newValues: Partial<StopConfig>): Stop {
    return new Stop({ ...this, ...newValues });
  }
}
