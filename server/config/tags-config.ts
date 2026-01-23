export type TagsConfig = {
  readonly stopTagSuccession: TagSuccessionConfig;
  readonly lineTagSuccession: TagSuccessionConfig;
  readonly routeTagSuccession: TagSuccessionConfig;
};

export type TagSuccessionConfig = Readonly<Record<number, readonly number[]>>;
