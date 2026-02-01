export type LinesPageConfig = {
  readonly sections: readonly LinesPageSectionConfig[];
};

export type LinesPageSectionConfig = {
  readonly tag: number;
  readonly name: string;
};
