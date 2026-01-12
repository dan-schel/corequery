import type { RouteStop } from "./route-stop.js";

export class Route {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly tags: string[],
    readonly stops: readonly RouteStop[],
    readonly color:
      | "red"
      | "yellow"
      | "green"
      | "cyan"
      | "blue"
      | "pink"
      | "purple"
      | "gray"
      | null,
  ) {}
}
