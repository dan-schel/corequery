import type { Route } from "./route.js";

export class Line {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly routes: readonly Route[],
  ) {}
}
