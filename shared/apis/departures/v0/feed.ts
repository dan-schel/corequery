import z from "zod";

export const feedSchema = z.object({
  stopId: z.number(),
  desiredCount: z.number(),
  filterTokens: z.string().array(),

  // Will be required for infinite scrolling, as two departures can have the
  // same time.
  skips: z
    .object({
      sourceId: z.string(),
      intrasourceId: z.string(),
    })
    .array(),
});
