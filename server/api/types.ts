import type { Corequery } from "@/server/corequery.js";
import type { z, ZodType } from "zod";

export type ApiContext = {
  readonly app: Corequery;

  // Other stuff specific to the request, e.g. the auth token could also go
  // here.
  // readonly token: string | null;
};

export type ApiHandler<Args extends ZodType, Result extends ZodType> = (
  ctx: ApiContext,
  args: z.infer<Args>,
) => Promise<z.infer<Result>>;
