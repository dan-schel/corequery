export type AboutPageConfig = {
  readonly primaryMarkdown: string;

  readonly dataSources: readonly {
    readonly name: string;
    readonly licensingMessage: string | null;
    readonly links: readonly {
      readonly label: string;
      readonly url: string;
    }[];
  }[];
};
