import type { Api } from "@/shared/apis/types";
import type { z, ZodType } from "zod";

export type ApiClient<Args, Result> = Api<
  z.ZodType<unknown, Args>,
  z.ZodType<Result>
>;

export type ClientArgsOf<ApiType> =
  ApiType extends Api<ZodType<unknown, infer Args>, ZodType> ? Args : never;

export type ClientResultOf<ApiType> =
  ApiType extends Api<ZodType, ZodType<infer Result>> ? Result : never;
