import type { Api } from "@/shared/apis/types";
import type z from "zod";

export type ApiClient<Args, Result> = Api<
  z.ZodType<unknown, Args>,
  z.ZodType<Result>
>;

export type ClientArgsOf<ApiType> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ApiType extends Api<infer Args, any> ? z.input<Args> : never;

export type ClientResultOf<ApiType> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ApiType extends Api<any, infer Result> ? z.output<Result> : never;
