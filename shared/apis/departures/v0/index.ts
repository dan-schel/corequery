import z from "zod";
import type { Api } from "@/shared/apis/types.js";
import { createFodaSyncedResultSchema } from "@/shared/apis/foda-synced-result.js";
import { departureSchema } from "@/shared/apis/departures/v0/departure.js";
import { feedSchema } from "@/shared/apis/departures/v0/feed.js";

// NOTE: This is a "v0" API, i.e. its not intended to be used by anyone except
// me, during the "beta" phase. When we switch to "v1" it'll break compatibility
// with frontends that only understand the v0 API, and that's A-OK.

const argsSchema = z.object({
  instant: z.string(),
  direction: z.enum(["forwards", "backwards"]),

  feeds: feedSchema.array(),
});

const resultSchema = createFodaSyncedResultSchema(
  z.object({
    feeds: z.object({ departures: departureSchema.array() }).array(),

    // If the client calls the departures API when its FODA is outdated, it
    // might include filter tokens that aren't valid, e.g. `stops-at-123` after
    // stop #123 is gone. In that case, the server will pretend the tokens
    // evaluate to true, and return them here so the frontend knows to show a
    // toast saying the filters were modified, or whatever.
    invalidFilterTokens: z.string().array(),
  }),
);

export const api: Api<typeof argsSchema, typeof resultSchema> = {
  path: "/departures/v0",
  argsSchema,
  resultSchema,
};
