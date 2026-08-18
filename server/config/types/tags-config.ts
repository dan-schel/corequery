export type TagsConfig = {
  readonly stopTagSuccession: TagSuccessionConfig;
  readonly lineTagSuccession: TagSuccessionConfig;
  readonly serviceTagSuccession: TagSuccessionConfig;
};

export type TagSuccessionConfig = Readonly<Record<number, readonly number[]>>;
