import type { Corequery } from "@/server/corequery.js";
import type { Api } from "@/shared/apis/types.js";
import type { z, ZodType } from "zod";

export type ApiServer<Args, Result> = Api<
  z.ZodType<Args>,
  z.ZodType<unknown, Result>
>;

export type ServerArgsOf<ApiType> =
  ApiType extends Api<ZodType<infer Args>, ZodType> ? Args : never;

export type ServerResultOf<ApiType> =
  ApiType extends Api<ZodType, ZodType<unknown, infer Result>> ? Result : never;

export type ServerFodaSyncedResultOf<ApiType> =
  ApiType extends Api<ZodType, ZodType<unknown, { innerResult: infer Result }>>
    ? Result
    : never;

export type ApiContext = {
  readonly app: Corequery;

  // Other stuff specific to the request, e.g. the auth token could also go
  // here.
  // readonly token: string | null;
};

export type ApiHandler<Args, Result> = (
  ctx: ApiContext,
  args: Args,
) => Promise<Result>;
