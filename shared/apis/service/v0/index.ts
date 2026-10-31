import z from "zod";
import type { Api } from "@/shared/apis/types.js";
import { createFodaSyncedResponse } from "@/shared/apis/foda-synced-result.js";

// NOTE: This is a "v0" API, i.e. its not intended to be used by anyone except
// me, during the "beta" phase. When we switch to "v1" it'll break compatibility
// with frontends that only understand the v0 API, and that's A-OK.

const argsSchema = z.object({
  sourceId: z.string(),
  intrasourceId: z.string(),
});

const resultSchema = createFodaSyncedResponse(
  z.object({
    service: z
      .object({
        sourceId: z.string(),
        intrasourceId: z.string(),

        primaryDestinationText: z.string(),

        lineIds: z.number().array().readonly(),
        color: z
          .object({
            lightModeHexCode: z.string(),
            darkModeHexCode: z.string(),
          })
          .nullable(),

        isCancelled: z.boolean(),

        movements: z
          .object({
            stopId: z.number(),
            positionId: z.number().nullable(),

            arrivalTime: z.string().nullable(),
            formerArrivalTime: z.string().nullable(),

            departureTime: z.string().nullable(),
            formerDepartureTime: z.string().nullable(),
          })
          .array()
          .readonly(),
      })
      .nullable(),
  }),
);

export const api: Api<typeof argsSchema, typeof resultSchema> = {
  path: "/service/v0",
  argsSchema,
  resultSchema,
};
