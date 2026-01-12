import type { LineDiagram } from "./line-diagram.js";
import type { Route } from "./route.js";

export class Line {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly code: string | null,
    readonly tags: string[],
    readonly urlPath: string,
    readonly routes: readonly Route[],
    readonly diagram: LineDiagram,
  ) {}
}
