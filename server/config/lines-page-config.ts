export type LinesPageConfig = {
  readonly sections: readonly LinesPageSection[];
};

export type LinesPageSection = {
  readonly tag: string;
  readonly name: string;
};
