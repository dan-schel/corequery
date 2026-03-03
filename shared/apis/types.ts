import z, { ZodType } from "zod";

export type Api<Args extends ZodType, Result extends ZodType> = {
  path: string;
  argsSchema: Args;
  resultSchema: Result;
};

export type ArgsOf<ApiType> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ApiType extends Api<infer Args, any> ? z.infer<Args> : never;

export type ResultOf<ApiType> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ApiType extends Api<any, infer Result> ? z.input<Result> : never;
