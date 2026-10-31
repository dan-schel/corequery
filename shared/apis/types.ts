import type { ZodType } from "zod";

export type Api<Args extends ZodType, Result extends ZodType> = {
  path: string;
  argsSchema: Args;
  resultSchema: Result;
};
