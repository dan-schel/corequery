import type { RouteStop } from "./route-stop.js";

export class Route {
  constructor(
    readonly id: number,
    readonly tags: string[],
    readonly stops: readonly RouteStop[],
  ) {}
}
