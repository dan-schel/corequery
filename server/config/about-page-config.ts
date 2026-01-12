export class AboutPageConfig {
  constructor(
    readonly primaryMarkdown: string,
    readonly dataSources: readonly DataSource[],
  ) {}
}

export class DataSource {
  constructor(
    readonly name: string,
    readonly licensingMessage: string | null,
    readonly links: readonly DataSourceLink[],
  ) {}
}

export class DataSourceLink {
  constructor(
    readonly label: string,
    readonly url: string,
  ) {}
}
