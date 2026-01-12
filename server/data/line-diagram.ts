export class LineDiagram {
  constructor(readonly entries: LineDiagramEntry[]) {}
}

export class LineDiagramEntry {
  constructor(
    readonly name: string | null,
    readonly color: string,

    // So far, line diagrams are limited to being linear sequences of stops.
    // This could be extended in the future to support branches, loops, etc.
    readonly stops: readonly LineDiagramStop[],
  ) {}
}

export class LineDiagramStop {
  constructor(
    readonly stopId: number,
    readonly type: "regular" | "always-express",
  ) {}
}
