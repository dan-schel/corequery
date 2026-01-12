import type { Location } from "./location.js";
import type { StopPosition } from "./stop-position.js";

export class Stop {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly tags: string[],
    readonly urlPath: string,
    readonly location: Location | null,
    readonly positions: readonly StopPosition[],
  ) {}
}
