export class LinesPageConfig {
  constructor(readonly sections: readonly LinesPageSection[]) {}
}

export class LinesPageSection {
  constructor(
    readonly tag: string,
    readonly name: string,
  ) {}
}
