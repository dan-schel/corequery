import { z, type ZodType } from "zod";

export function createFodaSyncedResponse<T extends ZodType>(
  innerResultSchema: T,
) {
  return z.object({
    foundationalDataHash: z.string(),
    innerResult: innerResultSchema,
  });
}
