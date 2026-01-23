export type TagsConfig = {
  readonly stopTagSuccession: TagSuccession;
  readonly lineTagSuccession: TagSuccession;
  readonly routeTagSuccession: TagSuccession;
};

export type TagSuccession = Readonly<Record<number, readonly number[]>>;
