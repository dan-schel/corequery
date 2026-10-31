import { z, type ZodType } from "zod";

export function createFodaSyncedResultSchema<T extends ZodType>(
  innerResultSchema: T,
) {
  return z.object({
    foundationalDataHash: z.string(),
    innerResult: innerResultSchema,
  });
}
