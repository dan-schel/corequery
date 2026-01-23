export type LinesPageConfig = {
  readonly sections: readonly LinesPageSectionConfig[];
};

export type LinesPageSectionConfig = {
  readonly tag: string;
  readonly name: string;
};
