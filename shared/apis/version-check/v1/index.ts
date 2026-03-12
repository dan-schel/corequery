import z from "zod";
import type { Api } from "@/shared/apis/types.js";

const argsSchema = z.object({
  frontendVersion: z.string(),
  corequeryPackageVersion: z.string(),
  foundationalDataHash: z.string(),
});

const resultSchema = z.object({
  isForceUpdateOfServiceWorkerRequired: z.boolean(),
  isForceUpdateOfFoundationalDataRequired: z.boolean(),
});

export const api: Api<typeof argsSchema, typeof resultSchema> = {
  path: "/version-check/v1",
  argsSchema,
  resultSchema,
};
