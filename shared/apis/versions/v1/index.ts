import z from "zod";
import type { Api } from "@/shared/apis/types.js";

const argsSchema = z.object({});

const resultSchema = z.object({
  serverVersion: z.string(),
  frontendVersion: z.string(),
  corequeryPackageVersion: z.string(),
  foundationalDataHash: z.string(),

  version: z.string().meta({ deprecated: true }),
});

export const api: Api<typeof argsSchema, typeof resultSchema> = {
  path: "/versions/v1",
  argsSchema,
  resultSchema,
};
