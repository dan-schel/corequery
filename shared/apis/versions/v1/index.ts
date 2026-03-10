import z from "zod";
import type { Api } from "@/shared/apis/types.js";

const argsSchema = z.object({});

const resultSchema = z.object({
  version: z.string(),
  foundationalDataHash: z.string(),
});

export const api: Api<typeof argsSchema, typeof resultSchema> = {
  path: "/versions/v1",
  argsSchema,
  resultSchema,
};
