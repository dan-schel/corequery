import z from "zod";
import type { Api } from "@/shared/apis/types.js";
import { createFodaSyncedResultSchema } from "@/shared/apis/foda-synced-result.js";

// NOTE: This is a "v0" API, i.e. its not intended to be used by anyone except
// me, during the "beta" phase. When we switch to "v1" it'll break compatibility
// with frontends that only understand the v0 API, and that's A-OK.

const argsSchema = z.object({
  stopId: z.number(),
  count: z.number(),

  // Remember that the v1 API should accept multiple departure streams, so we'll
  // need an array of these arguments! The result needs to be an array too, to
  // compensate.
  //
  // Other things the real v1 API should have:
  //
  // instant: z.string(),
  // direction: z.enum(["forwards", "backwards"]),
  // filters: z.string().array(),
  //
  // // Will be required for infinite scrolling, as two departures can have
  // // the same time.
  // skip: z
  //   .object({
  //     sourceId: z.string(),
  //     intrasourceId: z.string(),
  //   })
  //   .array(),
});

const resultSchema = createFodaSyncedResultSchema(
  z.object({
    departures: z
      .object({
        sourceId: z.string(),
        intrasourceId: z.string(),

        // TODO: Possibly we should calculate these on the frontend, and just pass
        // stop IDs for the destination and stopping pattern array (with an
        // `isServicing` flag for each entry) for the v1 API.
        //
        // We shouldn't just use `stoppingPatternText`, because I could see
        // different users wanting to configure what's shown, e.g. "just list all
        // stops", and Zen mode, which probably re-uses this API, wants to list
        // all stops rather than using "express between X and Y" text.
        //
        // The only complicating factor is how to deal with the fact that
        // sometimes the destination is not from the "current service" we give
        // sourceId/intrasourceId for, but from a future connecting service, e.g.
        // "Watergardens" when viewing citybound departures at Clayton, so we need
        // to find naming for that array that makes it clear that it's all the
        // movements for the same vehicle, until we see a servicing movement at a
        // stop which was already serviced. Once we find that repeated servicing
        // movement, we trim the array to end at the previous servicing movement.
        // What do we call that array?
        //
        // I also don't have a solution in mind for the secondary destination
        // text. If the frontend is expected to calculate it, then my current idea
        // to allow the consumer to configure arbitrary functions returning a
        // `string | null` for a given stop array won't work. I'll need something
        // a little more codified.
        primaryDestinationText: z.string(),
        secondaryDestinationText: z.string().nullable(),

        lineIds: z.number().array().readonly(),
        color: z
          .object({
            lightModeHexCode: z.string(),
            darkModeHexCode: z.string(),
          })
          .nullable(),

        isCancelled: z.boolean(),

        movement: z.object({
          // So that it can link to a service page.
          index: z.number(),

          positionId: z.number().nullable(),

          // "time" not "departureTime", as for arrivals it'll be the arrival time.
          time: z.string(),
          formerTime: z.string().nullable(),
        }),
      })
      .array(),
  }),
);

export const api: Api<typeof argsSchema, typeof resultSchema> = {
  path: "/departures/v0",
  argsSchema,
  resultSchema,
};
