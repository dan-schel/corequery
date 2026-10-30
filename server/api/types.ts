import type { Corequery } from "@/server/corequery.js";

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
