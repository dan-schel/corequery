import type { Corequery } from "@/server/corequery.js";
import type { Api } from "@/shared/apis/types.js";
import type z from "zod";

export type ApiServer<Args, Result> = Api<
  z.ZodType<Args>,
  z.ZodType<unknown, Result>
>;

export type ServerArgsOf<ApiType> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ApiType extends Api<infer Args, any> ? z.output<Args> : never;

export type ServerResultOf<ApiType> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ApiType extends Api<any, infer Result> ? z.input<Result> : never;

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
