import z from "zod";
import type { Api } from "@/shared/apis/types.js";
import { foundationalDataSchema } from "@/shared/apis/foundational-data/v1/foundational-data.js";

const argsSchema = z.object({});

const resultSchema = foundationalDataSchema;

export const api: Api<typeof argsSchema, typeof resultSchema> = {
  path: "/foundational-data/v1",
  argsSchema,
  resultSchema,
};
